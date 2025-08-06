import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type RecipeWithDetails = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { id: true; name: true; image: true } };
    ingredients: true;
    instructions: true;
    category: true;
    nutritionInfo: true;
    tags: { include: { tag: true } };
    _count: { select: { reviews: true; favorites: true } };
  };
}>;

export type RecipeCardData = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { id: true; name: true; image: true } };
    _count: { select: { reviews: true; favorites: true } };
  };
}>;

interface RecipeFilters {
  search?: string;
  categoryId?: string;
  cuisine?: string;
  difficulty?: string;
  maxCookTime?: number;
  userId?: string;
  public?: boolean;
  featured?: boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title" | "cookTime";
  sortOrder?: "asc" | "desc";
}

// Build where clause for recipe queries
function buildRecipeWhereClause(filters: RecipeFilters, userId?: string) {
  const where: Prisma.RecipeWhereInput = {};

  // Access control
  if (filters.public !== undefined) {
    where.public = filters.public;
  } else if (userId) {
    // Show public recipes + user's own recipes
    where.OR = [{ public: true }, { userId }];
  } else {
    // Anonymous users see only public recipes
    where.public = true;
  }

  // Search
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { cuisine: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Filters
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.cuisine) where.cuisine = filters.cuisine;
  if (filters.difficulty) where.difficulty = filters.difficulty;
  if (filters.maxCookTime) where.cookTime = { lte: filters.maxCookTime };
  if (filters.userId) where.userId = filters.userId;
  if (filters.featured) where.featured = filters.featured;

  return where;
}

// Get paginated recipes for listing pages
export async function getRecipes(
  filters: RecipeFilters = {},
  pagination: PaginationOptions = {},
  currentUserId?: string
) {
  const {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination;

  const skip = (page - 1) * limit;
  const where = buildRecipeWhereClause(filters, currentUserId);

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.recipe.count({ where }),
  ]);

  return {
    data: recipes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function getRecipeById(id: string, currentUserId?: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      ingredients: { orderBy: { order: "asc" } },
      instructions: { orderBy: { step: "asc" } },
      category: true,
      nutritionInfo: true,
      tags: { include: { tag: true } },
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10, // Limit reviews for performance
      },
      _count: { select: { reviews: true, favorites: true } },
    },
  });

  if (!recipe) return null;

  // Check if user can view this recipe
  const canView = recipe.public || recipe.userId === currentUserId;
  if (!canView) return null;

  return recipe;
}

// Check if user can edit recipe
export async function canEditRecipe(recipeId: string, userId: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { userId: true },
  });

  return recipe?.userId === userId;
}

// Get user's recipes
export async function getUserRecipes(
  userId: string,
  includePrivate = false,
  pagination: PaginationOptions = {}
) {
  const filters: RecipeFilters = {
    userId,
    ...(includePrivate ? {} : { public: true }),
  };

  return getRecipes(filters, pagination);
}

// Get recipes by category
export async function getRecipesByCategory(
  categorySlug: string,
  pagination: PaginationOptions = {},
  currentUserId?: string
) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) return null;

  const filters: RecipeFilters = { categoryId: category.id };
  const result = await getRecipes(filters, pagination, currentUserId);

  return {
    category,
    ...result,
  };
}

export async function getFeaturedRecipes(limit = 6, currentUserId?: string) {
  const filters: RecipeFilters = { featured: true, public: true };
  const result = await getRecipes(filters, { limit }, currentUserId);
  return result.data;
}

// Get latest recipes
export async function getLatestRecipes(limit = 6, currentUserId?: string) {
  const result = await getRecipes(
    { public: true },
    { limit, sortBy: "createdAt", sortOrder: "desc" },
    currentUserId
  );
  return result.data;
}

// Search recipes
export async function searchRecipes(
  query: string,
  filters: Omit<RecipeFilters, "search"> = {},
  pagination: PaginationOptions = {},
  currentUserId?: string
) {
  return getRecipes({ ...filters, search: query }, pagination, currentUserId);
}

export async function getRecipeStats(userId?: string) {
  const where = userId ? { userId } : { public: true };

  const [totalRecipes, avgCookTime, recipesByDifficulty, recipesByCategory] =
    await Promise.all([
      prisma.recipe.count({ where }),
      prisma.recipe.aggregate({
        where: { ...where, cookTime: { not: null } },
        _avg: { cookTime: true },
      }),
      prisma.recipe.groupBy({
        by: ["difficulty"],
        where: { ...where, difficulty: { not: null } },
        _count: { difficulty: true },
      }),
      prisma.recipe.groupBy({
        by: ["categoryId"],
        where: { ...where, categoryId: { not: null } },
        _count: { categoryId: true },
        // include: {
        //   category: { select: { name: true } },
        // },
      }),
    ]);

  return {
    totalRecipes,
    avgCookTime: Math.round(avgCookTime._avg.cookTime || 0),
    recipesByDifficulty,
    recipesByCategory,
  };
}
