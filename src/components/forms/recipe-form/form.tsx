"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
  notes: string | null;
}

interface Instruction {
  instruction: string;
}

interface RecipeFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any>;
  initialData?: {
    title?: string;
    description?: string;
    cookTime?: number;
    prepTime?: number;
    servings?: number;
    difficulty?: string;
    cuisine?: string;
    categoryId?: string;
    public?: boolean;
    ingredients?: Ingredient[];
    instructions?: Instruction[];
  };
  submitLabel: string;
}

export function RecipeForm({
  action,
  initialData,
  submitLabel,
}: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || [{ name: "", amount: "", unit: "", notes: "" }]
  );

  const [instructions, setInstructions] = useState<Instruction[]>(
    initialData?.instructions || [{ instruction: "" }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", amount: "", unit: "", notes: "" },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { instruction: "" }]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((instruction, i) =>
      i === index ? { ...instruction, instruction: value } : instruction
    );
    setInstructions(updated);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await action(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe Title *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initialData?.title}
              placeholder="Enter recipe title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData?.description}
              placeholder="Brief description of your recipe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="prepTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prep Time (minutes)
              </label>
              <Input
                id="prepTime"
                name="prepTime"
                type="number"
                min="1"
                defaultValue={initialData?.prepTime}
                placeholder="30"
              />
            </div>

            <div>
              <label
                htmlFor="cookTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cook Time (minutes)
              </label>
              <Input
                id="cookTime"
                name="cookTime"
                type="number"
                min="1"
                defaultValue={initialData?.cookTime}
                placeholder="45"
              />
            </div>

            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Servings
              </label>
              <Input
                id="servings"
                name="servings"
                type="number"
                min="1"
                defaultValue={initialData?.servings}
                placeholder="4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue={initialData?.difficulty}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="cuisine"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cuisine
              </label>
              <Input
                id="cuisine"
                name="cuisine"
                type="text"
                defaultValue={initialData?.cuisine}
                placeholder="e.g., Italian, Asian, Mexican"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="public"
                defaultChecked={initialData?.public}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Make this recipe public (others can view it)
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Ingredients */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Ingredients</h2>
          <Button
            type="button"
            onClick={addIngredient}
            variant="outline"
            size="sm"
            className="text-gray-600"
          >
            Add Ingredient
          </Button>
        </div>

        <div className="space-y-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end"
            >
              <div className="sm:col-span-5">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ingredient Name
                </label>
                <Input
                  name="ingredient-name"
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(index, "name", e.target.value)
                  }
                  placeholder="e.g., All-purpose flour"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <Input
                  name="ingredient-amount"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredient.amount}
                  onChange={(e) =>
                    updateIngredient(index, "amount", e.target.value)
                  }
                  placeholder="2"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <Input
                  name="ingredient-unit"
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) =>
                    updateIngredient(index, "unit", e.target.value)
                  }
                  placeholder="cups"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Input
                  name="ingredient-notes"
                  type="text"
                  value={ingredient.notes || ""}
                  onChange={(e) =>
                    updateIngredient(index, "notes", e.target.value)
                  }
                  placeholder="diced"
                />
              </div>

              <div className="sm:col-span-1">
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Instructions</h2>
          <Button
            type="button"
            onClick={addInstruction}
            variant="outline"
            size="sm"
            className="text-gray-700"
          >
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <Textarea
                  name="instruction"
                  value={instruction.instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}: Describe what to do...`}
                  rows={2}
                  required
                />
              </div>
              {instructions.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50 self-start mt-1"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1 sm:flex-initial"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>

        <Button type="button" variant="outline" size="sm">
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

export default RecipeForm;
