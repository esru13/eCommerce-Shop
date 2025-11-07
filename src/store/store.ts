import { configureStore } from "@reduxjs/toolkit";

// Placeholder reducer - replace with your actual reducers when you add them
const placeholderReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    placeholder: placeholderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

