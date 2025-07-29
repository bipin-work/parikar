import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createRecipeSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')
    const authorId = searchParams.get('author')
    
    const skip = (page - 1) * limit

    const where: any = {
      isPublic: true,
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ingredients: { some: { name: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (authorId) {
      where.authorId = authorId
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
          ingredients: true,
          tags: { include: { tag: true } },
          ratings: { select: { value: true } },
          _count: { select: { savedBy: true, ratings: true } }
        }
      }),
      prisma.recipe.count({ where })
    ])

    // Calculate average ratings
    const recipesWithRatings = recipes.map(recipe => ({
      ...recipe,
      averageRating: recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length
        : 0,
      ratings: undefined // Remove individual ratings from response
    }))

    return NextResponse.json({
      recipes: recipesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createRecipeSchema.parse(body)

    // Create or find tags
    const tagPromises = validatedData.tags.map(async (tagName) => {
      const slug = slugify(tagName)
      return await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: tagName, slug }
      })
    })

    const tags = await Promise.all(tagPromises)

    // Create recipe
    const recipe = await prisma.recipe.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        instructions: validatedData.instructions,
        prepTime: validatedData.prepTime,
        cookTime: validatedData.cookTime,
        servings: validatedData.servings,
        difficulty: validatedData.difficulty,
        categoryId: validatedData.categoryId,
        isPublic: validatedData.isPublic,
        authorId: session.user.id,
        ingredients: {
          create: validatedData.ingredients
        },
        tags: {
          create: tags.map(tag => ({ tagId: tag.id }))
        }
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        ingredients: true,
        tags: { include: { tag: true } }
      }
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 })
  }
}