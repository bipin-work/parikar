import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Recipes",
};

const AllRecipes: React.FC = () => {
  return (
    <div>
      <p>All recipes</p>
      <Link href="/2">Product 2</Link>
      <Link href="/3">Product 3</Link>
    </div>
  );
};
export default AllRecipes;
