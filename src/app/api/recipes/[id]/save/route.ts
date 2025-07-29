import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: { id: true, isPublic: true }
    })

    if (!recipe || !recipe.isPublic) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Check if already saved
    const existingSaved = await prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: params.id
        }
      }
    })

    if (existingSaved) {
      return NextResponse.json({ error: 'Recipe already saved' }, { status: 400 })
    }

    // Save recipe
    await prisma.savedRecipe.create({
      data: {
        userId: session.user.id,
        recipeId: params.id
      }
    })

    return NextResponse.json({ message: 'Recipe saved successfully' })
  } catch (error) {
    console.error('Error saving recipe:', error)
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 })
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

    // Remove saved recipe
    await prisma.savedRecipe.deleteMany({
      where: {
        userId: session.user.id,
        recipeId: params.id
      }
    })

    return NextResponse.json({ message: 'Recipe unsaved successfully' })
  } catch (error) {
    console.error('Error unsaving recipe:', error)
    return NextResponse.json({ error: 'Failed to unsave recipe' }, { status: 500 })
  }
}