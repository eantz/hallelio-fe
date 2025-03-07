import axios, { InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";


function http() {
  const axiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  const authInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = (await cookies()).get('token')?.value
  
    if (token !== undefined && token !== null) {
      config.headers?.set('Authorization', 'Bearer ' + token)
    }
    return config;
  }
  
  const targetURLInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.url = (process.env.NEXT_PUBLIC_BE_HOST ?? '') + config.url
  
    return config
  }

  axiosInstance.interceptors.request.use(authInterceptor);
  axiosInstance.interceptors.request.use(targetURLInterceptor);


  async function get(path: string, params: Record<string, any> | null, additionalConfig?: Record<string, any> | undefined) : Promise<any> {
    return await axiosInstance.get(path, {
      params: params,
      ...additionalConfig
    }).then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  async function post(path: string, data: Record<string, any> | FormData[], additionalConfig?: Record<string, any> | undefined) : Promise<any> {
    return await axiosInstance.post(
      path, 
      data,
      additionalConfig
    )
    .then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  async function put(path: string, data: Record<string, any>, additionalConfig?: Record<string, any> | undefined) : Promise<any> {
    return await axiosInstance.put(
      path, 
      data,
      additionalConfig
    )
    .then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  async function remove(path: string, data: Record<string, any>) : Promise<any> {
    return await axiosInstance.delete(
      path, 
      data
    )
    .then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  return {
    get,
    post,
    put,
    delete: remove
  }
}

export interface ResponseObject{
  status: string,
  message?: Record<string, any>,
  data?: Record<string, any>
}

export default http