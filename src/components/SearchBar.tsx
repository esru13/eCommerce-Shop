"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchProducts, resetProducts, fetchProducts, setSelectedCategory } from "@/store/slices/productsSlice";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);

  useEffect(() => {
    if (selectedCategory) {
      setQuery("");
    }
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        dispatch(setSelectedCategory(null));
        dispatch(searchProducts(query));
      } else {
        dispatch(resetProducts());
        dispatch(fetchProducts({ skip: 0, limit: 10 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search Products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
      />
    </div>
  );
}

