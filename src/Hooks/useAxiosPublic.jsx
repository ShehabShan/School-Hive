import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://server-six-vert.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
