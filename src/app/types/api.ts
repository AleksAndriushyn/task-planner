import type { AxiosRequestConfig } from "axios";

export interface ApiRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any; 
  params?: any;
  config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>;
}