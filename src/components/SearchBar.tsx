"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchProducts, resetProducts, fetchProducts, setSelectedCategory } from "@/store/slices/productsSlice";
import PriceFilter from "@/components/PriceFilter";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { Product } from "@/types/product";

interface SearchBarProps {
  onFilterClick?: () => void;
}

export default function SearchBar({ onFilterClick }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);

  useEffect(() => {
    if (selectedCategory) {
      setQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [selectedCategory]);

  // Fetch search suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.SEARCH_PRODUCTS}?q=${encodeURIComponent(query)}&limit=5`
        );
        setSuggestions(response.data.products || []);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: Product) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    dispatch(setSelectedCategory(null));
    dispatch(searchProducts(suggestion.title));
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

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
            onFocus={handleInputFocus}
            className="pl-8 pr-3 h-9 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 text-sm"
          />
          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ${suggestion.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
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

