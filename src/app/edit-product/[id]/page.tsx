"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        setError("");
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_PRODUCT_BY_ID(productId)
        );
        const product = response.data;
        
        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          brand: product.brand || "",
          category: product.category || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product");
        toast.error("Failed to load product", {
          description: err.response?.data?.message || "Product not found",
        });
      } finally {
        setFetching(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (data: typeof formData) => {
    setError("");
    setLoading(true);

    try {
      const productData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        brand: data.brand,
        category: data.category,
      };

      await axiosInstance.patch(API_ENDPOINTS.PUT_UPDATE_PRODUCT(productId), productData);
      
      toast.success("Product updated successfully!", {
        description: "Redirecting to product page...",
      });
      
      setTimeout(() => {
        router.push(`/product/${productId}`);
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update product";
      setError(errorMessage);
      toast.error("Failed to update product", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !formData.title) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button onClick={() => router.push("/")} variant="outline">
                  Go to Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href={`/product/${productId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Product
        </Link>

        <ProductForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
          loadingLabel="Updating..."
          title="Edit Product"
          productId={productId}
        />
      </div>
    </main>
  );
}

