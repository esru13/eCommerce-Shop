"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const favoriteProducts = useAppSelector(
    (state) => state.favorites.favoriteProducts
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteProducts.length === 0
              ? "You haven't added any favorites yet."
              : `You have ${favoriteProducts.length} favorite product${
                  favoriteProducts.length !== 1 ? "s" : ""
                }.`}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Start adding products to your favorites!
              <div>
              <Link href="/" className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">Products page</Link>
              </div>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

