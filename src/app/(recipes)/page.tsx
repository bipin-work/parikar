import React, { Suspense } from "react";
import { Metadata } from "next";
import RecipeList from "@/components/recipe/RecipeList";
import { auth } from "@/lib/auth";

import { SignOut } from "@/components/ui/SignOut";

export const metadata: Metadata = {
  title: "All Recipes",
};

const AllRecipes: React.FC = async () => {
  const session = await auth();
  return (
    <div>
      <p>Welcome! {session?.user?.name || "User"}.All recipes</p>

      <Suspense>
        <RecipeList />
      </Suspense>
      <SignOut />
    </div>
  );
};
export default AllRecipes;
