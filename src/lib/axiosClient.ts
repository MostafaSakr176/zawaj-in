// src/lib/axiosClient.ts
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_URL || "https://zwajin.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the access token from cookies
api.interceptors.request.use(
  (config) => {
    // If config.headers["skipAuth"] is true, do not set Authorization header
    // Usage: api.get("/endpoint", { headers: { skipAuth: true } })
    if (config.headers && (config.headers as any).skipAuth) {
      // Remove skipAuth from headers before sending
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
    return config;
  },
  (error) => Promise.reject(error)
);

export default api