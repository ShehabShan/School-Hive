import axios from "axios";
import toast from "react-hot-toast";
import { getNavigate } from "../lib/navigation";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app",
  withCredentials: true,
});

let interceptorsRegistered = false;
let pendingLogout = false;
let pendingLogoutTimer = null;

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
      const status = error.response?.status;
      const config = error.config || {};
      // Allow callers to suppress auto-redirect (e.g. follow toggle probe)
      if (config._skipAuthRedirect) return Promise.reject(error);
      // Ignore JWT endpoints to avoid loops
      const url = String(config.url || "");
      if (url.includes("/jwt") || url.includes("/clear-jwt")) return Promise.reject(error);

      if ((status === 401 || status === 403) && !pendingLogout) {
        pendingLogout = true;
        // Clear token so subsequent requests don't retry with stale token
        localStorage.removeItem("access-token");
        const navigate = getNavigate();
        // Debounce to avoid multiple toasts/redirects
        clearTimeout(pendingLogoutTimer);
        pendingLogoutTimer = setTimeout(() => {
          pendingLogout = false;
        }, 2500);

        // Prefer SPA navigation (preserves state.from) over hard reload
        if (navigate) {
          toast.error(status === 403 ? "Access denied — please sign in" : "Session expired — please sign in");
          const from = window.location.pathname + window.location.search;
          // Avoid redirecting if already on signIn
          if (!window.location.pathname.startsWith("/signIn")) {
            navigate("/signIn", { replace: true, state: { from } });
          }
        } else {
          // Fallback for contexts outside Router (rare)
          window.location.href = "/signIn";
        }
      }
      return Promise.reject(error);
    }
  );
}
registerInterceptors();

export function resetPendingLogout() {
  pendingLogout = false;
  clearTimeout(pendingLogoutTimer);
}

const useAxiosSecure = () => axiosInstance;

export default useAxiosSecure;
export { axiosInstance };
