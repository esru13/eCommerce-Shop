"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Star, Package, Tag, Edit, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite, removeFavorite } from "@/store/slices/favoritesSlice";
import { hydrateAuth } from "@/store/slices/authSlice";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ProductDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  brand?: string;
  stock?: number;
  images: string[];
  thumbnail?: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = params.id as string;
  const isFavorite = product ? favorites.includes(product.id) : false;

  useEffect(() => {
    dispatch(hydrateAuth());
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_PRODUCT_BY_ID(productId)
        );
        setProduct(response.data);
        setSelectedImage(0);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleToggleFavorite = () => {
    if (product) {
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
    }
  };

  const handleDeleteClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to delete products", {
        description: "Redirecting to login page...",
      });
      router.push("/login");
      return;
    }
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!product) return;

    setDeleting(true);

    try {
      await axiosInstance.delete(API_ENDPOINTS.DELETE_PRODUCT(productId));

      if (isFavorite) {
        dispatch(removeFavorite(product.id));
      }

      toast.success("Product deleted successfully", {
        description: `${product.title} has been deleted.`,
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete product";
      toast.error("Failed to delete product", {
        description: errorMessage,
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || "Product not found"}</p>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </div>
        </div>
      </main>
    );
  }

  const mainImage = product.images[selectedImage] || product.thumbnail || product.images[0] || "";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Section */}
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-red-500 dark:border-red-400"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase mb-2">{product.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.title}</h1>

                {product.brand && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Brand: {product.brand}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{product.rating}</span>
                  </div>
                  {product.stock !== undefined && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className={`text-sm ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">${product.price}</p>
                </div>
              </div>

              {product.description && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <div className="flex gap-4">
                  {mounted && isAuthenticated ? (
                    <Button
                      onClick={() => router.push(`/edit-product/${productId}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Product
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        toast.error("Please login to edit products", {
                          description: "Redirecting to login page...",
                        });
                        router.push("/login");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Product
                    </Button>
                  )}
                  <Button
                    onClick={handleToggleFavorite}
                    variant={isFavorite ? "outline" : "outline"}
                    className={`flex-1 ${
                      isFavorite
                        ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
                        : ""
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  disabled={deleting}
                  className="w-full"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {deleting ? "Deleting..." : "Delete Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description={`Are you sure you want to delete ${product?.title}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleting}
      />
    </main>
  );
}

