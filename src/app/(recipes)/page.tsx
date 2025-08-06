import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getRecipes } from "@/lib/queries/recipe";
import RecipeList from "@/components/recipe/RecipeList";

export const metadata: Metadata = {
  title: "All Recipes",
};

const AllRecipes: React.FC = async () => {
  return (
    <div>
      <p>All recipes</p>
      <Suspense>
        <RecipeList />
      </Suspense>
    </div>
  );
};
export default AllRecipes;
