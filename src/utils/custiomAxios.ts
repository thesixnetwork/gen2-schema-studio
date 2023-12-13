import axios from 'axios';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"
import ENV from '@/utils/ENV'
import { getServerSession } from "next-auth"



const api = axios.create({
  baseURL: ENV.API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Check if the token is available and not expired
    // If not, refresh the token
    getServerSession().then(console.log)
    const cookieStore = cookies()
    const isToken = cookieStore.get('next-auth.session-token')
    // console.log(isToken)
    console.log(process.env.NEXTAUTH_SECRET)
    const token = jwt.verify(isToken?.value, "1212121")
    // const token = localStorage.getItem('access_token');
    console.log("token =====>",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // console.log(error)
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
  // Implement your logic to refresh the token
  // Make a request to your server to get a new token
  // Update the localStorage with the new token
  // Retry the failed request
  console.log("refreshAccessToken")
};

export default api;