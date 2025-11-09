"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Heart } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

export default function FloatingActions() {
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
          aria-label="Go to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      {isMobile && (
        <Link href="/favorites">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all bg-red-500 hover:bg-red-600 text-white relative"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-red-500">
                {favorites.length}
              </span>
            )}
          </Button>
        </Link>
      )}
    </div>
  );
}

