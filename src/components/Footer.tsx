"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-red-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              eCommerce Shop
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} eCommerce Shop. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

