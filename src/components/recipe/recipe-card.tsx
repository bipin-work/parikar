'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Bookmark,
  ChefHat 
} from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface Recipe {
  id: string
  title: string
  description?: string
  image?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  author: {
    id: string
    name: string
    image?: string
  }
  averageRating: number
  _count: {
    savedBy: number
    ratings: number
  }
}

interface RecipeCardProps {
  recipe: Recipe
  onSave?: (recipeId: string) => void
  onUnsave?: (recipeId: string) => void
  isSaved?: boolean
}

const difficultyColors = {
  EASY: 'text-green-600 bg-green-100',
  MEDIUM: 'text-yellow-600 bg-yellow-100',
  HARD: 'text-red-600 bg-red-100'
}

export default function RecipeCard({ recipe, onSave, onUnsave, isSaved = false }: RecipeCardProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSaved && onUnsave) {
      onUnsave(recipe.id)
    } else if (!isSaved && onSave) {
      onSave(recipe.id)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="relative aspect-video bg-gray-200">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ChefHat className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Save Button */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveClick}
              className="bg-white/90 hover:bg-white text-gray-700 h-8 w-8"
            >
              {isSaved ? (
                <Bookmark className="h-4 w-4 fill-orange-500 text-orange-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/recipes/${recipe.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
        </Link>
        
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Recipe Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(totalTime)}</span>
            </div>
          )}
          
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
          
          {recipe.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{recipe.averageRating.toFixed(1)}</span>
              <span className="text-gray-400">({recipe._count.ratings})</span>
            </div>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
            {recipe.author.image ? (
              <Image
                src={recipe.author.image}
                alt={recipe.author.name}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {recipe.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600">{recipe.author.name}</span>
        </div>
      </CardContent>
    </Card>
  )
}