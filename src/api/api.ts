import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7168/api",
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");

  if (auth) {
    const token = JSON.parse(auth).token;

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
