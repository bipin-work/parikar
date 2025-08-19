"use client";
import Image from "next/image";
import { RecipeCardData } from "@/lib/queries/recipe";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import Button from "../ui/Button";
import { redirect } from "next/navigation";
import { deleteRecipeAction } from "@/lib/actions/recipe-action";

interface RecipeCardProps {
  recipe: RecipeCardData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const onEdit = (id: string) => {
    redirect(`/${id}`);
  };

  const onDelete = async (id: string) => {
    await deleteRecipeAction(id);
  };
  const onView = (id: string) => {};
  return (
    <Card className="h-full">
      {recipe.imageUrl && (
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
        <p className="text-sm text-gray-600">
          Prep: {recipe.prepTime} min • Cook: {recipe.cookTime} min
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-sm line-clamp-3">
          {recipe.description}
        </p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {recipe.difficulty}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="primary" size="sm" onClick={() => onView(recipe.id)}>
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(recipe.id)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(recipe.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
