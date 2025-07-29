import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { shareRecipeSchema } from '@/lib/validations'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { toUserId, message } = shareRecipeSchema.parse({
      recipeId: params.id,
      ...body
    })

    // Check if recipe exists and is public
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: { id: true, isPublic: true, title: true }
    })

    if (!recipe || !recipe.isPublic) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: toUserId },
      select: { id: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create shared recipe record
    const sharedRecipe = await prisma.sharedRecipe.create({
      data: {
        fromUserId: session.user.id,
        toUserId,
        recipeId: params.id,
        message
      },
      include: {
        fromUser: { select: { id: true, name: true, image: true } },
        recipe: { select: { id: true, title: true, image: true } }
      }
    })

    return NextResponse.json(sharedRecipe, { status: 201 })
  } catch (error) {
    console.error('Error sharing recipe:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to share recipe' }, { status: 500 })
  }
}