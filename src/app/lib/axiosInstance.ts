import type { ApiRequestConfig } from "@/types/api";
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const API_BASE_URL = `${supabaseUrl}/rest/v1`;

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
  }
});

export const apiClient = async <T>({
    url,
    method,
    data,
    params,
    config
}: ApiRequestConfig): Promise<T> => {
  try {
    const response = await apiInstance.request<T>({
      url,
      method,
      data,
      params,
      ...config,
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.status_message || error.message);
    }
    throw error;
  }
};
