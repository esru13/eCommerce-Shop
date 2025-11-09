"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isFavorite = favorites.includes(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasFavorite = isFavorite;
    dispatch(toggleFavorite(product));
    
    if (wasFavorite) {
      toast.info("Removed from favorites", {
        description: `${product.title} has been removed from your favorites.`,
      });
    } else {
      toast.success("Added to favorites", {
        description: `${product.title} has been added to your favorites.`,
      });
    }
  };

  const imageUrl = product.thumbnail || product.images[0] || "";

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <Link href={`/product/${product.id}`}>
        <CardHeader className="p-0 cursor-pointer">
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                No Image
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{product.category}</p>
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] hover:text-red-500 transition-colors text-gray-900 dark:text-white">
              {product.title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-yellow-500">★</span>
                <span className="text-sm text-gray-900 dark:text-white">{product.rating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleToggleFavorite}
          variant={isFavorite ? "outline" : "outline"}
          className={`w-full ${
            isFavorite
              ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/30"
              : ""
          }`}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
          {isFavorite ? "Remove Favorites" : "Add to Favorites"}
        </Button>
      </CardFooter>
    </Card>
  );
}

