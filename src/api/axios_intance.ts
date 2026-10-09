import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 60000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const refresh = localStorage.getItem("refreshToken");
  if (refresh) {
    config.headers["x-refresh-token"] = refresh;
  }

  return config;
});

// Session expirée : on nettoie et on renvoie vers la connexion
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = !!localStorage.getItem("token");
    if (axios.isAxiosError(error) && error.response?.status === 401 && hadToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;