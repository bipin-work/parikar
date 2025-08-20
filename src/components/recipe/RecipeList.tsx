import React from "react";
import { getRecipes } from "@/lib/queries/recipe";
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
