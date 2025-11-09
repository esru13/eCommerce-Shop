"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsByCategory, resetProducts, fetchProducts, setSelectedCategory, setPriceRange } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { useEffect, useState } from "react";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FilterModal({ open, onClose }: FilterModalProps) {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);
  const priceRange = useAppSelector((state) => state.products.priceRange);
  const [minPrice, setMinPrice] = useState(priceRange?.min?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(priceRange?.max?.toString() || "");

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (priceRange) {
      setMinPrice(priceRange.min?.toString() || "");
      setMaxPrice(priceRange.max?.toString() || "");
    } else {
      setMinPrice("");
      setMaxPrice("");
    }
  }, [priceRange]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    onClose();
  };

  const handleAllClick = () => {
    dispatch(setSelectedCategory(null));
    dispatch(resetProducts());
    dispatch(fetchProducts({ skip: 0, limit: 10 }));
    onClose();
  };

  const handlePriceApply = () => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    if (minPrice || maxPrice) {
      dispatch(setPriceRange({ min, max }));
    } else {
      dispatch(setPriceRange(null));
    }
  };

  const handlePriceClear = () => {
    setMinPrice("");
    setMaxPrice("");
    dispatch(setPriceRange(null));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] md:hidden"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close filter"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Price Filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Filter by Price</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="modal-min-price" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                Min Price
              </Label>
              <Input
                id="modal-min-price"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-9 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                min="0"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="modal-max-price" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                Max Price
              </Label>
              <Input
                id="modal-max-price"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-9 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="default"
              size="sm"
              onClick={handlePriceApply}
              className="flex-1"
            >
              Apply Price
            </Button>
            {priceRange && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePriceClear}
                className="flex-1"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Filter by Category</h3>
          {loading && categories.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500 dark:text-gray-400">Loading categories...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="lg"
                onClick={handleAllClick}
                className="w-full justify-start text-left"
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleCategoryClick(category)}
                  className="w-full justify-start text-left capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

