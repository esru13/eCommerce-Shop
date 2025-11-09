"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Heart, LogIn, LogOut, User, ChevronDown, Plus, Menu, X, Moon, Sun } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout, hydrateAuth } from "@/store/slices/authSlice";
import { toggleTheme } from "@/store/slices/themeSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(hydrateAuth());
    setMounted(true);
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (userMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setUserMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  // Close mobile menu when clicking outside or on escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    toast.success("Logged out successfully", {
      description: "You have been logged out. Redirecting to login page...",
    });
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <nav className="sticky top-0 z-[60] w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4 relative">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              eCommerce<span className="hidden md:inline"> Shop</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            {mounted && isAuthenticated ? (
              <Link href="/add-product">
                <Button variant="outline" size="sm" className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-500"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}

            <Link href="/favorites">
              <Button variant="outline" size="sm" className="relative hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-500">
                <Heart className="h-4 w-4 text-red-500" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white animate-pulse">
                    {favorites.length}
                  </span>
                )}
                <span className="ml-2">Favorites</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(toggleTheme())}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {mounted && isAuthenticated && user ? (
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <User className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                    </div>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-500">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(toggleTheme())}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
              data-mobile-menu-button
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed top-[64px] left-0 right-0 bottom-0 bg-black/40 dark:bg-black/60 z-[45] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="md:hidden absolute top-full left-0 right-0 mx-4 rounded-b-2xl border-x border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl z-[55]" data-mobile-menu>
              <div className="py-3">
              {mounted && isAuthenticated ? (
                <Link
                  href="/add-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg mx-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Product
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left rounded-lg mx-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Product
                </button>
              )}

              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative rounded-lg mx-2"
              >
                <Heart className="h-5 w-5 text-red-500" />
                Favorites
                {favorites.length > 0 && (
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {mounted && isAuthenticated && user ? (
                <>
                  <div className="px-5 py-4 mx-2 mt-2 mb-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left rounded-lg mx-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg mx-2"
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </Link>
              )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

