import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getRecipes } from "@/lib/queries/recipe";
import RecipeList from "@/components/recipe/RecipeList";
import { auth } from "@/lib/auth";
import { setEngine } from "crypto";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "All Recipes",
};

const AllRecipes: React.FC = async () => {
  const session = await auth();

  if (!session) redirect("/login/sign-in");
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
