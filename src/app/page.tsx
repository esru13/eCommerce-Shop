"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { Loader2 } from "lucide-react";

export default function Home() {
  const dispatch = useAppDispatch();
  const { products, loading, error, total, skip, selectedCategory } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (products.length === 0 && !loading && total === 0 && selectedCategory === null) {
      dispatch(fetchProducts({ skip: 0, limit: 10 }));
    }
  }, [dispatch, products.length, loading, total, selectedCategory]);

  const loadMoreProducts = useCallback(() => {
    if (!loading && skip < total && !selectedCategory) {
      dispatch(fetchProducts({ skip, limit: 10 }));
    }
  }, [dispatch, loading, skip, total, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProducts]);

  const isInitialState = products.length === 0 && total === 0 && skip === 0;
  const showLoading = loading || (isInitialState && !error);
  const showNoProducts = !loading && !isInitialState && products.length === 0 && !error;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-2">
        <div className="mb-2 flex items-center">
          <SearchBar />
        </div>
        <CategoryFilter />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showLoading && products.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {showNoProducts && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No products found
          </div>
        )}

        {products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
              </div>
            )}

            {!loading && skip >= total && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No more products to load
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
