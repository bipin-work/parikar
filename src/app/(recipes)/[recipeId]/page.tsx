import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditRecipeForm from "@/ui/recipe-form/edit/edit-form";

export const metadata: Metadata = {
  title: "Edit",
};

interface EditRecipeProps {
  params: Promise<{ recipeId: string }>;
}

export default async function EditRecipe(props: EditRecipeProps) {
  const recipeId = (await props.params).recipeId || "0";
  if (+recipeId > 10) {
    return notFound();
  }
  return (
    <p>
      Edit page {recipeId} <EditRecipeForm />
    </p>
  );
}
