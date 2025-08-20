/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createRecipeSchema,
  recipeFormSchema,
  extractIngredientsFromFormData,
  extractInstructionsFromFormData,
  parseFormData,
} from "@/lib/validations";
import { Ingredient, Instruction } from "@prisma/client";

const demoUserId = "cmdzo4hi20008s196vl7tl56a";

// Helper to get current user
// async function getCurrentUser() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     throw new Error("Authentication required");
//   }
//   return session.user;
// }

export async function createRecipeAction(formData: FormData) {
  try {
    // const user = await getCurrentUser();

    const user = { id: demoUserId };

    const basicData = parseFormData(formData, recipeFormSchema);

    const ingredients = extractIngredientsFromFormData(formData);
    const instructions = extractInstructionsFromFormData(formData);

    const recipeData = createRecipeSchema.parse({
      title: basicData.title,
      description: basicData.description || undefined,
      cookTime: basicData.cookTime ? Number(basicData.cookTime) : undefined,
      prepTime: basicData.prepTime ? Number(basicData.prepTime) : undefined,
      servings: basicData.servings ? Number(basicData.servings) : undefined,
      difficulty: basicData.difficulty || undefined,
      cuisine: basicData.cuisine || undefined,
      categoryId: basicData.categoryId || undefined,
      public: basicData.public === "on",
      ingredients,
      instructions,
    });

    const recipe = await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        cookTime: recipeData.cookTime,
        prepTime: recipeData.prepTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        cuisine: recipeData.cuisine,
        categoryId: recipeData.categoryId,
        public: recipeData.public,
        userId: user.id,
        ingredients: {
          create: recipeData.ingredients.map((ingredient, index) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            notes: ingredient.notes,
            order: index,
          })),
        },
        instructions: {
          create: recipeData.instructions.map((instruction, index) => ({
            step: index + 1,
            instruction: instruction.instruction,
          })),
        },
      },
    });

    revalidatePath("/");
    // revalidatePath("/profile");

    redirect(`/${recipe.id}`);
  } catch (error: any) {
    console.error("Create recipe error:", error);

    if (error.name === "ZodError") {
      return {
        error: "Invalid form data",
        details: error.errors,
      };
    }

    return {
      error: error.message || "Failed to create recipe",
    };
  }
}

export async function updateRecipeAction(recipeId: string, formData: FormData) {
  try {
    // const user = await getCurrentUser();
    const user = { id: demoUserId };

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { userId: true },
    });

    if (!existingRecipe) {
      return { error: "Recipe not found" };
    }

    if (existingRecipe.userId !== user.id) {
      return { error: "Access denied" };
    }

    const basicData = parseFormData(formData, recipeFormSchema);
    const ingredients = extractIngredientsFromFormData(formData);
    const instructions = extractInstructionsFromFormData(formData);

    const recipeData = createRecipeSchema.parse({
      title: basicData.title,
      description: basicData.description || undefined,
      cookTime: basicData.cookTime ? Number(basicData.cookTime) : undefined,
      prepTime: basicData.prepTime ? Number(basicData.prepTime) : undefined,
      servings: basicData.servings ? Number(basicData.servings) : undefined,
      difficulty: basicData.difficulty || undefined,
      cuisine: basicData.cuisine || undefined,
      categoryId: basicData.categoryId || undefined,
      public: basicData.public === "on",
      ingredients,
      instructions,
    });

    await prisma.$transaction(async (tx: any) => {
      await tx.ingredient.deleteMany({
        where: { recipeId },
      });
      await tx.instruction.deleteMany({
        where: { recipeId },
      });

      await tx.recipe.update({
        where: { id: recipeId },
        data: {
          title: recipeData.title,
          description: recipeData.description,
          cookTime: recipeData.cookTime,
          prepTime: recipeData.prepTime,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          cuisine: recipeData.cuisine,
          categoryId: recipeData.categoryId,
          public: recipeData.public,
          updatedAt: new Date(),
          ingredients: {
            create: recipeData.ingredients.map((ingredient, index) => ({
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              notes: ingredient.notes,
              order: index,
            })),
          },
          instructions: {
            create: recipeData.instructions.map((instruction, index) => ({
              step: index + 1,
              instruction: instruction.instruction,
            })),
          },
        },
      });
    });

    // Revalidate cache
    // revalidatePath(`/${recipeId}`);
    // revalidatePath("/");
    // revalidatePath("/profile");
  } catch (error: any) {
    console.error("Update recipe error:", error);

    if (error.name === "ZodError") {
      return {
        error: "Invalid form data",
        details: error.errors,
      };
    }

    return {
      error: error.message || "Failed to update recipe",
    };
  }
  redirect("/");
}

export async function deleteRecipeAction(recipeId: string) {
  try {
    // const user = await getCurrentUser();
    const user = { id: demoUserId };

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { userId: true, title: true },
    });

    if (!recipe) {
      return { error: "Recipe not found" };
    }

    if (recipe.userId !== user.id) {
      return { error: "Access denied" };
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    revalidatePath("/");

    redirect("/");
  } catch (error: any) {
    console.error("Delete recipe error:", error);
    return {
      error: error.message || "Failed to delete recipe",
    };
  }
}

export async function toggleRecipeVisibilityAction(recipeId: string) {
  try {
    // const user = await getCurrentUser();
    const user = { id: demoUserId };

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { userId: true, public: true },
    });

    if (!recipe) {
      return { error: "Recipe not found" };
    }

    if (recipe.userId !== user.id) {
      return { error: "Access denied" };
    }

    await prisma.recipe.update({
      where: { id: recipeId },
      data: { public: !recipe.public },
    });

    // Revalidate cache
    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/profile");

    return { success: true, public: !recipe.public };
  } catch (error: any) {
    console.error("Toggle visibility error:", error);
    return {
      error: error.message || "Failed to update recipe visibility",
    };
  }
}

export async function toggleFavoriteAction(recipeId: string) {
  try {
    const user = { id: demoUserId };

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true, public: true, userId: true },
    });

    if (!recipe) {
      return { error: "Recipe not found" };
    }

    if (!recipe.public && recipe.userId !== user.id) {
      return { error: "Access denied" };
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_recipeId: {
            userId: user.id,
            recipeId,
          },
        },
      });

      revalidatePath(`/recipes/${recipeId}`);
      return { success: true, favorited: false };
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: user.id,
          recipeId,
        },
      });

      revalidatePath(`/recipes/${recipeId}`);
      return { success: true, favorited: true };
    }
  } catch (error: any) {
    console.error("Toggle favorite error:", error);
    return {
      error: error.message || "Failed to update favorite",
    };
  }
}

export async function cloneRecipeAction(originalRecipeId: string) {
  try {
    const user = { id: demoUserId };

    const originalRecipe = await prisma.recipe.findUnique({
      where: { id: originalRecipeId },
      include: {
        ingredients: { orderBy: { order: "asc" } },
        instructions: { orderBy: { step: "asc" } },
      },
    });

    if (!originalRecipe) {
      return { error: "Recipe not found" };
    }

    if (!originalRecipe.public && originalRecipe.userId !== user.id) {
      return { error: "Access denied" };
    }

    const clonedRecipe = await prisma.recipe.create({
      data: {
        title: `${originalRecipe.title} (Copy)`,
        description: originalRecipe.description,
        cookTime: originalRecipe.cookTime,
        prepTime: originalRecipe.prepTime,
        servings: originalRecipe.servings,
        difficulty: originalRecipe.difficulty,
        cuisine: originalRecipe.cuisine,
        categoryId: originalRecipe.categoryId,
        public: false,
        userId: user.id,
        ingredients: {
          create: originalRecipe.ingredients.map((ingredient: Ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            notes: ingredient.notes,
            order: ingredient.order,
          })),
        },
        instructions: {
          create: originalRecipe.instructions.map(
            (instruction: Instruction) => ({
              step: instruction.step,
              instruction: instruction.instruction,
            })
          ),
        },
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/profile");

    redirect(`/recipes/${clonedRecipe.id}/edit`);
  } catch (error: any) {
    console.error("Clone recipe error:", error);
    return {
      error: error.message || "Failed to clone recipe",
    };
  }
}
