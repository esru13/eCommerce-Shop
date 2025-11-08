import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  isDarkMode: boolean;
}

const getInitialTheme = (): boolean => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved) {
      const isDark = saved === "dark";
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return isDark;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
    return prefersDark;
  }
  return false;
};

const initialState: ThemeState = {
  isDarkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
        if (state.isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload ? "dark" : "light");
        if (action.payload) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

