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

    const interceptors = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log("error caught in interceptors", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          logOut()
            .then(() => {
              console.log("logged out user");
              navigate("/signIn");
            })
            .catch((error) => console.log(error));
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptors);
    };
  }, [tokenLoaded, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
