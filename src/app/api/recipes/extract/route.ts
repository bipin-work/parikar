import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { extractRecipeFromBlog, extractRecipeFromYouTube } from '@/lib/ai'
import { extractRecipeSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url, type } = extractRecipeSchema.parse(body)

    let extractedRecipe
    
    if (type === 'blog') {
      extractedRecipe = await extractRecipeFromBlog(url)
    } else if (type === 'youtube') {
      extractedRecipe = await extractRecipeFromYouTube(url)
    } else {
      return NextResponse.json({ error: 'Invalid extraction type' }, { status: 400 })
    }

    // Add source information
    const recipe = {
      ...extractedRecipe,
      source: url,
      sourceType: type === 'blog' ? 'BLOG' : 'YOUTUBE'
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error extracting recipe:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to extract recipe' 
    }, { status: 500 })
  }
}