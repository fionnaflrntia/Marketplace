import ReactGA from "react-ga4";

const gaId = import.meta.env.VITE_GA_ID;

export const analytics = {
  // Auth Events
  trackRegister: (email: string, name: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Auth",
      action: "Register",
      label: email,
      value: 1,
    });
  },

  trackLogin: (email: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Auth",
      action: "Login",
      label: email,
      value: 1,
    });
  },

  trackLogout: () => {
    if (!gaId) return;
    ReactGA.event({
      category: "Auth",
      action: "Logout",
      value: 1,
    });
  },

  // Product Events
  trackViewProducts: (productCount: number) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: "View Product List",
      value: productCount,
    });
  },

  trackViewProductDetail: (productId: string, productName: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: "View Product Detail",
      label: `${productName} (${productId})`,
      value: 1,
    });
  },

  trackCreateProduct: (productName: string, price: number, category: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: "Create Product",
      label: `${productName} - Category: ${category}`,
      value: Math.round(price),
    });
  },

  trackUpdateProduct: (productId: string, productName: string, price: number) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: "Update Product",
      label: `${productName} (${productId})`,
      value: Math.round(price),
    });
  },

  trackDeleteProduct: (productId: string, productName: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: "Delete Product",
      label: `${productName} (${productId})`,
      value: 1,
    });
  },

  // User Actions
  trackSearchProduct: (searchQuery: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: "Search",
      label: searchQuery,
      value: 1,
    });
  },

  trackFilterProducts: (filterType: string, filterValue: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Products",
      action: `Filter by ${filterType}`,
      label: filterValue,
      value: 1,
    });
  },

  trackError: (errorType: string, errorMessage: string) => {
    if (!gaId) return;
    ReactGA.event({
      category: "Error",
      action: errorType,
      label: errorMessage,
      value: 1,
    });
  },

  // Set user ID (optional - use after login)
  setUserId: (userId: string) => {
    if (!gaId) return;
    ReactGA.set({ user_id: userId });
  },
};
