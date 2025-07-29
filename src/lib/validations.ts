import { z } from 'zod'

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  instructions: z.string().min(1, 'Instructions are required'),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  servings: z.number().min(1).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  categoryId: z.string().optional(),
  isPublic: z.boolean().default(true),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.string().min(1),
    unit: z.string().optional(),
  })).min(1, 'At least one ingredient is required'),
  tags: z.array(z.string()).default([]),
})

export const updateRecipeSchema = createRecipeSchema.partial()

export const extractRecipeSchema = z.object({
  url: z.string().url('Please provide a valid URL'),
  type: z.enum(['blog', 'youtube']),
})

export const shareRecipeSchema = z.object({
  recipeId: z.string(),
  toUserId: z.string(),
  message: z.string().optional(),
})

export const ratingSchema = z.object({
  recipeId: z.string(),
  value: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  slug: z.string().min(1),
})

export const userProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional(),
})

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>
export type ExtractRecipeInput = z.infer<typeof extractRecipeSchema>
export type ShareRecipeInput = z.infer<typeof shareRecipeSchema>
export type RatingInput = z.infer<typeof ratingSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>