import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers?: any;
}

export const httpRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data: any = null,
  headers: Record<string, string> = {},
  params?: Record<string, any>,
): Promise<HttpResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers,
      params,
    };

    const response: AxiosResponse<T> = await axios(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Request failed with status ${error.response.status}: ${error.response.data.message || "Unknown error"}`,
      );
    } else if (error.request) {
      throw new Error(`No response received: ${error.message}`);
    } else {
      throw new Error(`Request setup failed: ${error.message}`);
    }
  }
};
