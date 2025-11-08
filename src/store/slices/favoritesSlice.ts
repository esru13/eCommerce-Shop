import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

interface FavoritesState {
  favorites: number[];
  favoriteProducts: Product[];
}

const initialState: FavoritesState = {
  favorites: [],
  favoriteProducts: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const productId = action.payload.id;
      const index = state.favorites.indexOf(productId);

      if (index === -1) {
        state.favorites.push(productId);
        state.favoriteProducts.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
        state.favoriteProducts = state.favoriteProducts.filter(
          (p) => p.id !== productId
        );
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter((id) => id !== productId);
      state.favoriteProducts = state.favoriteProducts.filter(
        (p) => p.id !== productId
      );
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

