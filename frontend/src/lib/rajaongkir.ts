// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-sandbox.collaborator.komerce.id/tariff/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
