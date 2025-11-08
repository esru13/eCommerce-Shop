"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

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

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        brand: formData.brand,
        category: formData.category,
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

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price *
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium mb-1">
                    Stock *
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1">
                  Brand *
                </label>
                <Input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creating..." : "Create Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

