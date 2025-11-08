"use client";

import { ShoppingBag, Heart } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const favorites = useAppSelector((state) => state.favorites.favorites);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-black-500" />
            <span className="text-xl font-bold text-gray-900">eCommerce Shop</span>
          </Link>
          {/* favourite icon */}
          <div className="flex items-center gap-4">
            <Link href="/favorites">
              <Button variant="outline" className="relative">
                <Heart className="h-5 w-5 text-red-500" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                    {favorites.length}
                  </span>
                )}
                <span className="ml-2 hidden sm:inline">Favorites</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

