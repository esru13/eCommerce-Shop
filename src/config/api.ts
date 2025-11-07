export const API_CONFIG = {
  BASE_URL: "https://dummyjson.com",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

//all endpoints
export const API_ENDPOINTS = {
  GET_ALL_PRODUCTS: "/products",
  SEARCH_PRODUCTS: "/products/search",
  GET_PRODUCT_BY_ID: (id: string | number) => `/products/${id}`,
  GET_ALL_CATEGORIES: "/products/categories",
  GET_PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
  POST_ADD_PRODUCT: "/products/add",
  PUT_UPDATE_PRODUCT: (id: string | number) => `/products/${id}`,
  DELETE_PRODUCT: (id: string | number) => `/products/${id}`,
};
