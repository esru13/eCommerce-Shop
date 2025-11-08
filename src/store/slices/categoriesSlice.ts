import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

interface CategoriesState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        if (typeof item === "string") {
          return item;
        }
        return item.slug || item.name || String(item);
      });
    }
    
    return [];
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default categoriesSlice.reducer;

