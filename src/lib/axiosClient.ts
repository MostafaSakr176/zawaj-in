// src/lib/axiosClient.ts
import axios from "axios"

const api = axios.create({
  baseURL: "https://api.qowa.ai",
  headers: {
    "Content-Type": "application/json",
  },
})

export default api