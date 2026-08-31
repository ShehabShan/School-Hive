import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosInstance = axios.create({
  baseURL: "https://server-six-vert.vercel.app",
  // baseURL: "http://localhost:5000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut, tokenLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokenLoaded) return;

    const requestInterceptors = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptors = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          logOut()
            .then(() => {
              navigate("/signIn");
            })
            .catch(() => {});
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptors);
      axiosInstance.interceptors.response.eject(responseInterceptors);
    };
  }, [tokenLoaded, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
