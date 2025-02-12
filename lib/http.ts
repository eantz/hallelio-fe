import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from 'universal-cookie';


function http() {
  const axiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const cookies = new Cookies(null, {path:'/'});
    const token = cookies.get('token');
  
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


  async function get(path: string, params: Record<string, any>) : Promise<any> {
    return await axiosInstance.get(path, {
      params: params,
    }).then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  async function post(path: string, data: Record<string, any>) : Promise<any> {
    return await axiosInstance.post(path, data)
    .then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  async function put(path: string, data: Record<string, any>) : Promise<any> {
    return await axiosInstance.put(path, data)
    .then(res => {
      return res;
    }).catch(error => {
      return error.response;
    });
  }

  async function remove(path: string, data: Record<string, any>) : Promise<any> {
    return await axiosInstance.delete(path, data)
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