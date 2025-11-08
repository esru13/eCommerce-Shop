"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  brand: string;
  category: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  loading: boolean;
  error: string;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
  loadingLabel: string;
  title: string;
  productId?: string;
}

export default function ProductForm({
  formData,
  setFormData,
  loading,
  error,
  onSubmit,
  submitLabel,
  loadingLabel,
  title,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleCancel = () => {
    if (productId) {
      router.push(`/product/${productId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
              <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
              <label htmlFor="stock" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
            <label htmlFor="brand" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
            <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input dark:border-gray-600 bg-background dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? loadingLabel : submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

