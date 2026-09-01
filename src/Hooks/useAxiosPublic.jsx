import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
