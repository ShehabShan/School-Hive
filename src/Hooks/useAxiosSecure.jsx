import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app",
  withCredentials: true,
});

let interceptorsRegistered = false;
let pendingLogout = null;

function registerInterceptors() {
  if (interceptorsRegistered) return;
  interceptorsRegistered = true;
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !pendingLogout) {
        pendingLogout = new Promise(() => {});
        window.location.href = "/signIn";
      }
      return Promise.reject(error);
    }
  );
}
registerInterceptors();

const useAxiosSecure = () => axiosInstance;

export default useAxiosSecure;
