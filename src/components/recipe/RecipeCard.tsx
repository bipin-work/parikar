import Link from "next/link";
import Image from "next/image";
import { RecipeCardData } from "@/lib/queries/recipe";

interface RecipeCardProps {
  recipe: RecipeCardData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/${recipe.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative h-48 bg-gray-200">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {!recipe.public && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            Private
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>by {recipe.user.name}</span>
          <div className="flex items-center gap-3">
            {recipe.cookTime && (
              <span className="flex items-center gap-1">
                ⏱️ {recipe.cookTime}m
              </span>
            )}
            {recipe._count.favorites > 0 && (
              <span className="flex items-center gap-1">
                ❤️ {recipe._count.favorites}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
