import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { extractYouTubeVideoId } from './utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ExtractedRecipe {
  title: string
  description?: string
  instructions: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  ingredients: Array<{
    name: string
    amount: string
    unit?: string
  }>
  tags: string[]
}

export async function extractRecipeFromBlog(url: string): Promise<ExtractedRecipe> {
  try {
    // Fetch the webpage content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    const $ = cheerio.load(response.data)
    
    // Extract text content from the page
    $('script, style, nav, header, footer, aside').remove()
    const textContent = $('body').text().replace(/\s+/g, ' ').trim()
    
    // Use OpenAI to extract recipe information
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a recipe extraction expert. Extract recipe information from the provided text and return it in valid JSON format. 
          
          Return the data in this exact structure:
          {
            "title": "Recipe Title",
            "description": "Brief description",
            "instructions": "Step by step instructions",
            "prepTime": 15,
            "cookTime": 30,
            "servings": 4,
            "difficulty": "EASY|MEDIUM|HARD",
            "ingredients": [
              {"name": "ingredient name", "amount": "1 cup", "unit": "cup"}
            ],
            "tags": ["tag1", "tag2"]
          }
          
          If any field is not available, omit it or set to null. Be accurate and extract only what's clearly stated.`
        },
        {
          role: 'user',
          content: `Extract recipe information from this text:\n\n${textContent.substring(0, 8000)}`
        }
      ],
      temperature: 0.1,
    })

    const result = completion.choices[0].message.content
    if (!result) throw new Error('No response from AI')
    
    return JSON.parse(result) as ExtractedRecipe
  } catch (error) {
    console.error('Error extracting recipe from blog:', error)
    throw new Error('Failed to extract recipe from blog')
  }
}

export async function extractRecipeFromYouTube(url: string): Promise<ExtractedRecipe> {
  try {
    const videoId = extractYouTubeVideoId(url)
    if (!videoId) throw new Error('Invalid YouTube URL')
    
    // Get video details using YouTube Data API
    const apiKey = process.env.YOUTUBE_API_KEY
    const videoResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    )
    
    const video = videoResponse.data.items[0]
    if (!video) throw new Error('Video not found')
    
    const title = video.snippet.title
    const description = video.snippet.description
    
    // Use OpenAI to extract recipe from video description
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a recipe extraction expert. Extract recipe information from YouTube video title and description and return it in valid JSON format. 
          
          Return the data in this exact structure:
          {
            "title": "Recipe Title",
            "description": "Brief description",
            "instructions": "Step by step instructions",
            "prepTime": 15,
            "cookTime": 30,
            "servings": 4,
            "difficulty": "EASY|MEDIUM|HARD",
            "ingredients": [
              {"name": "ingredient name", "amount": "1 cup", "unit": "cup"}
            ],
            "tags": ["tag1", "tag2"]
          }
          
          If any field is not available, omit it or set to null. Be accurate and extract only what's clearly stated.`
        },
        {
          role: 'user',
          content: `Extract recipe information from this YouTube video:\n\nTitle: ${title}\n\nDescription: ${description}`
        }
      ],
      temperature: 0.1,
    })

    const result = completion.choices[0].message.content
    if (!result) throw new Error('No response from AI')
    
    return JSON.parse(result) as ExtractedRecipe
  } catch (error) {
    console.error('Error extracting recipe from YouTube:', error)
    throw new Error('Failed to extract recipe from YouTube')
  }
}