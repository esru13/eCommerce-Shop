import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { Product } from "@/types/product";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
  selectedCategory: string | null;
  priceRange: { min: number; max: number } | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
  selectedCategory: null,
  priceRange: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ skip = 0, limit = 10 }: { skip?: number; limit?: number }) => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_PRODUCTS}?limit=${limit}&skip=${skip}`
    );
    return response.data;
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query: string) => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.SEARCH_PRODUCTS}?q=${query}`
    );
    return response.data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category: string) => {
    const encodedCategory = encodeURIComponent(category);
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_PRODUCTS_BY_CATEGORY(encodedCategory)
    );
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.skip = 0;
      state.total = 0;
      state.error = null;
      // Don't clear selectedCategory and priceRange here - they should be cleared explicitly
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const existingIds = new Set(state.products.map((p) => p.id));
        const newProducts = action.payload.products.filter(
          (p: Product) => !existingIds.has(p.id)
        );
        state.products = [...state.products, ...newProducts];
        state.total = action.payload.total;
        state.skip = action.payload.skip + action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.skip = 0;
        state.selectedCategory = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search products";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.skip = 0;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products by category";
      });
  },
});

export const { resetProducts, setSelectedCategory, setPriceRange } = productsSlice.actions;
export default productsSlice.reducer;

