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
import { ArrowLeft, Heart, Star, Package, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";

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

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = params.id as string;
  const isFavorite = product ? favorites.includes(product.id) : false;

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
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
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error || "Product not found"}</p>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </div>
        </div>
      </main>
    );
  }

  const mainImage = product.images[selectedImage] || product.thumbnail || product.images[0] || "";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Section */}
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                      className={`relative h-20 bg-gray-100 rounded-md overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-red-500"
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
                <p className="text-sm text-gray-500 uppercase mb-2">{product.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                {product.brand && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Brand: {product.brand}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-semibold">{product.rating}</span>
                  </div>
                  {product.stock !== undefined && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">${product.price}</p>
                </div>
              </div>

              {product.description && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="font-semibold mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

