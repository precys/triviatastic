import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically to every request, always get it fresh from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      console.log("setting header")
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handles JWT token error, status code 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized — logging out.");
      localStorage.removeItem("token");
      window.location.href = "/"; 
    } else {
      console.error(error);
    }
    return Promise.reject(error); 
  }
);

export default axiosClient;
