"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPriceRange, resetProducts, fetchProducts } from "@/store/slices/productsSlice";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PriceFilter() {
  const dispatch = useAppDispatch();
  const priceRange = useAppSelector((state) => state.products.priceRange);
  const [minPrice, setMinPrice] = useState(priceRange?.min?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(priceRange?.max?.toString() || "");

  useEffect(() => {
    if (priceRange) {
      setMinPrice(priceRange.min?.toString() || "");
      setMaxPrice(priceRange.max?.toString() || "");
    } else {
      setMinPrice("");
      setMaxPrice("");
    }
  }, [priceRange]);

  const handleApply = () => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    if (minPrice || maxPrice) {
      dispatch(setPriceRange({ min, max }));
    } else {
      dispatch(setPriceRange(null));
    }
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    dispatch(setPriceRange(null));
    dispatch(resetProducts());
    dispatch(fetchProducts({ skip: 0, limit: 10 }));
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Label htmlFor="min-price" className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
          Min:
        </Label>
        <Input
          id="min-price"
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-20 h-9 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          min="0"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="max-price" className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
          Max:
        </Label>
        <Input
          id="max-price"
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-20 h-9 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          min="0"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleApply}
        className="h-9 text-xs"
      >
        Apply
      </Button>
      {priceRange && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="h-9 w-9"
          aria-label="Clear price filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

