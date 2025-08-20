import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getRecipeById } from "@/lib/queries/recipe";
import { updateRecipeAction } from "@/lib/actions/recipe-action";
import RecipeForm from "@/components/forms/recipe-form/form";

export const metadata: Metadata = {
  title: "Edit",
};

interface EditRecipeProps {
  params: Promise<{ recipeId: string }>;
}

export default async function EditRecipe(props: EditRecipeProps) {
  const recipeId = (await props.params).recipeId || "0";
  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    redirect("/recipes");
  }
  const updateAction = updateRecipeAction.bind(null, recipeId);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white-900">Edit Recipe</h1>
        <p className="text-white-600 mt-2">Update your recipe details</p>
      </div>

      <RecipeForm
        action={updateAction}
        initialData={{
          title: recipe.title,
          description: recipe.description || "",
          cookTime: recipe.cookTime || undefined,
          prepTime: recipe.prepTime || undefined,
          servings: recipe.servings || undefined,
          difficulty: recipe.difficulty || undefined,
          cuisine: recipe.cuisine || undefined,
          categoryId: recipe.categoryId || undefined,
          public: recipe.public,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        }}
        submitLabel="Update Recipe"
      />
    </div>
  );
}
