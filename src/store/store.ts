import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import favoritesReducer from "./slices/favoritesSlice";
import categoriesReducer from "./slices/categoriesSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    categories: categoriesReducer,
    theme: themeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

