import React from "react";
import { getRecipes } from "@/lib/queries/recipe";
import Button from "../ui/Button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RecipeCard } from "./RecipeCard";
const RecipeList: React.FC = async () => {
  const recipes = await getRecipes();

  return (
    <div>
      {recipes.data.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
export default RecipeList;
