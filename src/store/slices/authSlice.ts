import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
}

const getInitialAuth = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const authData = JSON.parse(saved);
        return {
          isAuthenticated: authData.isAuthenticated || false,
          user: authData.user || null,
        };
      } catch {
        return { isAuthenticated: false, user: null };
      }
    }
  }
  return { isAuthenticated: false, user: null };
};

const initialState: AuthState = getInitialAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "auth",
          JSON.stringify({ isAuthenticated: true, user: action.payload })
        );
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    },
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("auth");
        if (saved) {
          try {
            const authData = JSON.parse(saved);
            state.isAuthenticated = authData.isAuthenticated || false;
            state.user = authData.user || null;
          } catch {
            state.isAuthenticated = false;
            state.user = null;
          }
        }
      }
    },
  },
});

export const { login, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;

