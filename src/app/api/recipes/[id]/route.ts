import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateRecipeSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, image: true, bio: true } },
        category: { select: { id: true, name: true, slug: true } },
        ingredients: true,
        tags: { include: { tag: true } },
        ratings: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { savedBy: true, ratings: true } }
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Check if recipe is public or user owns it
    const session = await getServerSession(authOptions)
    if (!recipe.isPublic && recipe.authorId !== session?.user?.id) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Calculate average rating
    const averageRating = recipe.ratings.length > 0 
      ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length
      : 0

    return NextResponse.json({
      ...recipe,
      averageRating
    })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the recipe
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    })

    if (!existingRecipe || existingRecipe.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Recipe not found or unauthorized' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateRecipeSchema.parse(body)

    // Update recipe
    const recipe = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ingredients: validatedData.ingredients ? {
          deleteMany: {},
          create: validatedData.ingredients
        } : undefined
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        ingredients: true,
        tags: { include: { tag: true } }
      }
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error updating recipe:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the recipe
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    })

    if (!existingRecipe || existingRecipe.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Recipe not found or unauthorized' }, { status: 404 })
    }

    await prisma.recipe.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}