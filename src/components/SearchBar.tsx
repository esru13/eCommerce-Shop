"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchProducts, resetProducts, fetchProducts, setSelectedCategory } from "@/store/slices/productsSlice";
import PriceFilter from "@/components/PriceFilter";

interface SearchBarProps {
  onFilterClick?: () => void;
}

export default function SearchBar({ onFilterClick }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div className="sticky top-16 z-40 bg-gray-50 dark:bg-gray-900 py-2 -mx-4 px-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 w-full max-w-full">
        <div className="relative flex-1 min-w-0 md:max-w-2xl">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-3 h-9 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 text-sm"
          />
        </div>
        {/* Price filter on desktop - beside search bar */}
        <div className="hidden md:block">
          <PriceFilter />
        </div>
        {onFilterClick && (
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterClick}
            className="h-9 w-9 flex-shrink-0 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Filter products"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

