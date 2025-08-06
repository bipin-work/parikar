// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const breakfast = await prisma.category.create({
    data: {
      name: "Breakfast",
      slug: "breakfast",
    },
  });

  const lunch = await prisma.category.create({
    data: {
      name: "Lunch",
      slug: "lunch",
    },
  });

  const dinner = await prisma.category.create({
    data: {
      name: "Dinner",
      slug: "dinner",
    },
  });

  const dessert = await prisma.category.create({
    data: {
      name: "Dessert",
      slug: "dessert",
    },
  });

  // Create tags
  const vegetarian = await prisma.tag.create({
    data: { name: "Vegetarian", slug: "vegetarian" },
  });

  const vegan = await prisma.tag.create({
    data: { name: "Vegan", slug: "vegan" },
  });

  const glutenFree = await prisma.tag.create({
    data: { name: "Gluten Free", slug: "gluten-free" },
  });

  const quickEasy = await prisma.tag.create({
    data: { name: "Quick & Easy", slug: "quick-easy" },
  });

  // Create a demo user
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo User",
    },
  });

  // Create sample recipes
  const pancakeRecipe = await prisma.recipe.create({
    data: {
      title: "Fluffy Pancakes",
      description: "Light and fluffy pancakes perfect for weekend mornings",
      cookTime: 15,
      prepTime: 10,
      servings: 4,
      difficulty: "Easy",
      cuisine: "American",
      public: true,
      userId: demoUser.id,
      categoryId: breakfast.id,
      ingredients: {
        create: [
          { name: "All-purpose flour", amount: 2, unit: "cups", order: 0 },
          { name: "Sugar", amount: 2, unit: "tbsp", order: 1 },
          { name: "Baking powder", amount: 2, unit: "tsp", order: 2 },
          { name: "Salt", amount: 1, unit: "tsp", order: 3 },
          { name: "Milk", amount: 1.75, unit: "cups", order: 4 },
          { name: "Egg", amount: 1, unit: "large", order: 5 },
          {
            name: "Butter",
            amount: 3,
            unit: "tbsp",
            notes: "melted",
            order: 6,
          },
        ],
      },
      instructions: {
        create: [
          {
            step: 1,
            instruction:
              "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
          },
          {
            step: 2,
            instruction:
              "In another bowl, whisk together milk, egg, and melted butter.",
          },
          {
            step: 3,
            instruction:
              "Pour the wet ingredients into the dry ingredients and stir until just combined. Don't overmix.",
          },
          {
            step: 4,
            instruction:
              "Heat a griddle or large skillet over medium heat. Lightly grease with butter.",
          },
          {
            step: 5,
            instruction:
              "Pour 1/4 cup of batter for each pancake. Cook until bubbles form on surface, then flip.",
          },
          {
            step: 6,
            instruction:
              "Cook until golden brown on both sides. Serve hot with syrup.",
          },
        ],
      },
      nutritionInfo: {
        create: {
          calories: 280,
          protein: 8,
          carbs: 45,
          fat: 7,
          fiber: 2,
          sugar: 8,
        },
      },
      tags: {
        create: [{ tagId: vegetarian.id }, { tagId: quickEasy.id }],
      },
    },
  });

  const saladRecipe = await prisma.recipe.create({
    data: {
      title: "Mediterranean Quinoa Salad",
      description:
        "A healthy and refreshing salad packed with Mediterranean flavors",
      cookTime: 0,
      prepTime: 20,
      servings: 6,
      difficulty: "Easy",
      cuisine: "Mediterranean",
      public: true,
      userId: demoUser.id,
      categoryId: lunch.id,
      ingredients: {
        create: [
          {
            name: "Quinoa",
            amount: 1,
            unit: "cup",
            notes: "cooked and cooled",
            order: 0,
          },
          {
            name: "Cherry tomatoes",
            amount: 2,
            unit: "cups",
            notes: "halved",
            order: 1,
          },
          {
            name: "Cucumber",
            amount: 1,
            unit: "large",
            notes: "diced",
            order: 2,
          },
          {
            name: "Red onion",
            amount: 0.25,
            unit: "cup",
            notes: "finely chopped",
            order: 3,
          },
          {
            name: "Feta cheese",
            amount: 0.5,
            unit: "cup",
            notes: "crumbled",
            order: 4,
          },
          {
            name: "Kalamata olives",
            amount: 0.25,
            unit: "cup",
            notes: "pitted and halved",
            order: 5,
          },
          {
            name: "Fresh parsley",
            amount: 0.25,
            unit: "cup",
            notes: "chopped",
            order: 6,
          },
          { name: "Olive oil", amount: 3, unit: "tbsp", order: 7 },
          { name: "Lemon juice", amount: 2, unit: "tbsp", order: 8 },
          { name: "Salt", amount: 1, unit: "tsp", order: 9 },
          { name: "Black pepper", amount: 0.5, unit: "tsp", order: 10 },
        ],
      },
      instructions: {
        create: [
          {
            step: 1,
            instruction:
              "Cook quinoa according to package directions and let cool completely.",
          },
          {
            step: 2,
            instruction:
              "In a large bowl, combine cooled quinoa, tomatoes, cucumber, red onion, feta, olives, and parsley.",
          },
          {
            step: 3,
            instruction:
              "In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.",
          },
          {
            step: 4,
            instruction: "Pour dressing over salad and toss to combine.",
          },
          {
            step: 5,
            instruction: "Let marinate for at least 15 minutes before serving.",
          },
          { step: 6, instruction: "Serve chilled or at room temperature." },
        ],
      },
      nutritionInfo: {
        create: {
          calories: 220,
          protein: 8,
          carbs: 28,
          fat: 9,
          fiber: 4,
          sugar: 6,
        },
      },
      tags: {
        create: [
          { tagId: vegetarian.id },
          { tagId: glutenFree.id },
          { tagId: quickEasy.id },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
  console.log(`Created ${await prisma.recipe.count()} recipes`);
  console.log(`Created ${await prisma.category.count()} categories`);
  console.log(`Created ${await prisma.tag.count()} tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
