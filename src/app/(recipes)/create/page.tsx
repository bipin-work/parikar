import { Metadata } from "next";
import { createRecipeAction } from "@/lib/actions/recipe-action";
import { RecipeForm } from "@/components/forms/recipe-form/form";

export const metadata: Metadata = {
  title: "Create",
};

export default function CreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Recipe</h1>
        <p className="text-gray-600 mt-2">
          Share your delicious recipe with the community
        </p>
      </div>

      <RecipeForm action={createRecipeAction} submitLabel="Create Recipe" />
    </div>
  );
}
