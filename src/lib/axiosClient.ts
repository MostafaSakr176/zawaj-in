// // src/lib/axiosClient.ts
// import axios from "axios";
// import Cookies from "js-cookie";

// const api = axios.create({
//   baseURL:process.env.NEXT_PUBLIC_API_URL || "https://zwajin.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to include the access token from cookies
// api.interceptors.request.use(
//   (config) => {
//     // If config.headers["skipAuth"] is true, do not set Authorization header
//     // Usage: api.get("/endpoint", { headers: { skipAuth: true } })
//     if (config.headers && (config.headers as any).skipAuth) {
//       // Remove skipAuth from headers before sending
//       delete (config.headers as any).skipAuth;
//       return config;
//     }

//     const token = Cookies.get("access_token");
//     if (token) {
//       if (config.headers && typeof config.headers.set === "function") {
//         config.headers.set("Authorization", `Bearer ${token}`);
//       } else if (config.headers) {
//         (config.headers as any)["Authorization"] = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api




// src/lib/axiosClient.ts
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://zwajin.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get current locale
function getLocale() {
  if (typeof window !== "undefined") {
    // Try to get locale from pathname: /en/... or /ar/...
    const match = window.location.pathname.match(/^\/(en|ar)\b/);
    if (match) return match[1];
    // Or from cookies if you store it
    const cookieLocale = Cookies.get("NEXT_LOCALE");
    if (cookieLocale === "en" || cookieLocale === "ar") return cookieLocale;
  }
  // Default to 'en'
  return "en";
}

// Add a request interceptor to include the access token from cookies and lang param
api.interceptors.request.use(
  (config) => {
    // If config.headers["skipAuth"] is true, do not set Authorization header
    if (config.headers && (config.headers as any).skipAuth) {
      delete (config.headers as any).skipAuth;
      return config;
    }

    const token = Cookies.get("access_token");
    if (token) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else if (config.headers) {
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
      }
    }

    // Add lang param based on locale
    const locale = getLocale();
    if (!config.params) config.params = {};
    config.params.lang = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

export default api