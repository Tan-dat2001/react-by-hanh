import axios from "axios";

export const axiosClient = () => {
  axios.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("JWT");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });
};
