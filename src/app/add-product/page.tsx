"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      await axiosInstance.post(API_ENDPOINTS.POST_ADD_PRODUCT, productData);
      
      toast.success("Product created successfully!", {
        description: "Redirecting to products page...",
      });
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create product";
      setError(errorMessage);
      toast.error("Failed to create product", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

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

        <ProductForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          submitLabel="Create Product"
          loadingLabel="Creating..."
          title="Add New Product"
        />
      </div>
    </main>
  );
}

