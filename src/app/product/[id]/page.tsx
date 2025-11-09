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
import { ArrowLeft, Heart, Star, Package, Tag, Edit, Trash2, X, Maximize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
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
  const [showFullImage, setShowFullImage] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [showFullImage, selectedImage]);

  useEffect(() => {
    if (!showFullImage || !product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && product.images.length > 1) {
        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && product.images.length > 1) {
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape") {
        setShowFullImage(false);
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((prev) => Math.min(prev + 0.25, 3));
      } else if (e.key === "-") {
        e.preventDefault();
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
      } else if (e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullImage, product]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleNextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleToggleFavorite = () => {
    if (!product) return;
    const wasFavorite = isFavorite;
    dispatch(toggleFavorite(product));
    toast[wasFavorite ? "info" : "success"](
      wasFavorite ? "Removed from favorites" : "Added to favorites",
      { description: `${product.title} has been ${wasFavorite ? "removed from" : "added to"} your favorites.` }
    );
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
            <div className="space-y-4">
              <div
                className="relative w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => setShowFullImage(true)}
              >
                {mainImage ? (
                  <>
                    <Image src={mainImage} alt={product.title} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No Image</div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? "border-red-500 dark:border-red-400" : "border-transparent"
                      }`}
                    >
                      <Image src={image} alt={`${product.title} ${index + 1}`} fill className="object-cover" sizes="(max-width: 1024px) 25vw, 12.5vw" />
                    </button>
                  ))}
                </div>
              )}
            </div>

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

                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">${product.price}</p>
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
                  <Button
                    onClick={() => {
                      if (mounted && isAuthenticated) {
                        router.push(`/edit-product/${productId}`);
                      } else {
                        toast.error("Please login to edit products", { description: "Redirecting to login page..." });
                        router.push("/login");
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Product
                  </Button>
                  <Button
                    onClick={handleToggleFavorite}
                    variant="outline"
                    className={`flex-1 ${isFavorite ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100" : ""}`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorite ? "Remove Favourite" : "Add to Favorites"}
                  </Button>
                </div>
                <Button onClick={handleDeleteClick} variant="destructive" disabled={deleting} className="w-full">
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

      {showFullImage && mainImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 z-[101] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close image"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="absolute top-4 left-4 z-[101] flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            {zoom !== 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[101] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[101] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center overflow-hidden cursor-move" 
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                src={product.images[selectedImage] || mainImage}
                alt={product.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[101] px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
              {selectedImage + 1} / {product.images.length}
            </div>
          )}
          {zoom !== 1 && (
            <div className="absolute bottom-4 right-4 z-[101] px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
              {Math.round(zoom * 100)}%
            </div>
          )}
        </div>
      )}
    </main>
  );
}
