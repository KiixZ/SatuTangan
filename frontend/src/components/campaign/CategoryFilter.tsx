import { useEffect, useState } from "react";
import type { Category } from "../../types/campaign";
import categoryService from "../../services/categoryService";
import { Button } from "../ui/button";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        // Ensure we set an array
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (
          response.data &&
          typeof response.data === "object" &&
          "categories" in response.data &&
          Array.isArray((response.data as any).categories)
        ) {
          setCategories((response.data as any).categories);
        } else {
          console.error("Invalid categories response:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">Filter Kategori</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full"
        >
          Semua
        </Button>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
      </div>
    </div>
  );
};
