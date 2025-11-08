"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsByCategory, resetProducts, fetchProducts, setSelectedCategory } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { useEffect } from "react";

export default function CategoryFilter() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      dispatch(setSelectedCategory(null));
      dispatch(resetProducts());
      dispatch(fetchProducts({ skip: 0, limit: 10 }));
    } else {
      dispatch(resetProducts());
      dispatch(setSelectedCategory(category));
      dispatch(fetchProductsByCategory(category));
    }
  };

  if (loading && categories.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-16 z-40 bg-gray-50 dark:bg-gray-900 py-2 -mx-4 px-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => {
            dispatch(setSelectedCategory(null));
            dispatch(resetProducts());
            dispatch(fetchProducts({ skip: 0, limit: 10 }));
          }}
          className="flex-shrink-0"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className="capitalize flex-shrink-0 whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}

