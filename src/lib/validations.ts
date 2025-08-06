// lib/validations.ts
import { z } from "zod";

// Ingredient schema
export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  unit: z.string().min(1, "Unit is required"),
  notes: z.string().optional(),
});

// Instruction schema
export const instructionSchema = z.object({
  instruction: z.string().min(1, "Instruction cannot be empty"),
});

// Recipe schemas
export const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  cookTime: z.coerce.number().positive().optional(),
  prepTime: z.coerce.number().positive().optional(),
  servings: z.coerce.number().positive().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  cuisine: z.string().optional(),
  categoryId: z.string().optional(),
  public: z.boolean().default(false),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient required"),
  instructions: z
    .array(instructionSchema)
    .min(1, "At least one instruction required"),
});

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string().cuid(),
});

// Search and filter schemas
export const recipeFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.string().optional(),
  maxCookTime: z.coerce.number().positive().optional(),
  userId: z.string().optional(),
  public: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  sortBy: z.enum(["createdAt", "title", "cookTime"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Form data schemas (for FormData parsing)
export const recipeFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  cookTime: z.string().optional(),
  prepTime: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.string().optional(),
  cuisine: z.string().optional(),
  categoryId: z.string().optional(),
  public: z.string().optional(),
  // Ingredients and instructions will be handled separately
});

// Helper function to parse form data
export function parseFormData<T>(
  formData: FormData,
  schema: z.ZodSchema<T>
): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Handle multiple values (like checkboxes)
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  return schema.parse(data);
}

// Utility to extract ingredients and instructions from FormData
export function extractIngredientsFromFormData(formData: FormData) {
  const ingredients: z.infer<typeof ingredientSchema>[] = [];
  const ingredientNames = formData.getAll("ingredient-name");
  const ingredientAmounts = formData.getAll("ingredient-amount");
  const ingredientUnits = formData.getAll("ingredient-unit");
  const ingredientNotes = formData.getAll("ingredient-notes");

  for (let i = 0; i < ingredientNames.length; i++) {
    if (ingredientNames[i] && ingredientAmounts[i] && ingredientUnits[i]) {
      ingredients.push({
        name: ingredientNames[i] as string,
        amount: Number(ingredientAmounts[i]),
        unit: ingredientUnits[i] as string,
        notes: (ingredientNotes[i] as string) || undefined,
      });
    }
  }

  return ingredients;
}

export function extractInstructionsFromFormData(formData: FormData) {
  const instructions: z.infer<typeof instructionSchema>[] = [];
  const instructionTexts = formData.getAll("instruction");

  for (const instruction of instructionTexts) {
    if (instruction) {
      instructions.push({
        instruction: instruction as string,
      });
    }
  }

  return instructions;
}
