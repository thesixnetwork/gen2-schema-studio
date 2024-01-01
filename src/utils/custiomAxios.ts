"use server";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import ENV from "@/utils/ENV";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

const api = axios.create({
  baseURL: ENV.API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check if the token is available and not expired
    // If not, refresh the token
    const sesstion = await getServerSession(authOptions);
    // console.log("sssssssss",sesstion)

    if (sesstion) {
        config.headers.Authorization = `Bearer ${sesstion.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  async (error) => {
    // Check if the error is due to an expired token
    // console.log(error.response.status);
    if (error.response.status === 401) {
      // Refresh the token and retry the request
      await refreshAccessToken();
      // Retry the original request
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

// Function to refresh the access token
const refreshAccessToken = async () => {

  const sesstion = await getServerSession(authOptions);
  const apiUrl = `/auth/refreshToken`;
  const requestData = {
    "refresh_token": sesstion.user.accessToken,
    };
    const req = await api.post(apiUrl, requestData)
    // console.log(req.data.data.access_token)
  api.interceptors.request.use(
    async (config) => {
      if (req.data.data.access_token) {
        config.headers.Authorization = `Bearer ${req.data.data.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  console.log("refreshAccessToken");
};

export default api;
