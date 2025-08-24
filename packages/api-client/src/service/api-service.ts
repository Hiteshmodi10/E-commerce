import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Api service interface used across the client builders
export type ApiServiceInterface = {
  get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig): Promise<R>;
  patch<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig): Promise<R>;
  put<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig): Promise<R>;
  delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T>;
};

let _apiService: ApiServiceInterface | null = null;

export const apiService: ApiServiceInterface = {
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig) {
    if (!_apiService) throw new Error('apiService not configured');
    return _apiService.get<T>(endpoint, config);
  },
  async post<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig) {
    if (!_apiService) throw new Error('apiService not configured');
    return _apiService.post<T, R>(endpoint, payload, config);
  },
  async patch<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig) {
    if (!_apiService) throw new Error('apiService not configured');
    return _apiService.patch<T, R>(endpoint, payload, config);
  },
  async put<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig) {
    if (!_apiService) throw new Error('apiService not configured');
    return _apiService.put<T, R>(endpoint, payload, config);
  },
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig) {
    if (!_apiService) throw new Error('apiService not configured');
    return _apiService.delete<T>(endpoint, config);
  },
};

type ConfigureOpts = {
  baseUrl?: string;
  getToken?: () => Promise<string | null> | string | null;
  axiosConfig?: AxiosRequestConfig;
};

class AxiosApiService implements ApiServiceInterface {
  private axiosInstance: AxiosInstance;
  private getToken?: () => Promise<string | null> | string | null;

  constructor(baseURL?: string, getToken?: ConfigureOpts['getToken'], axiosConfig?: AxiosRequestConfig) {
    this.getToken = getToken;
    this.axiosInstance = axios.create({ baseURL, ...axiosConfig, withCredentials: true });

    // Request interceptor: attach bearer token when available
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = this.getToken ? await (this.getToken as () => Promise<string | null>)() : null;
          if (token) {
            config.headers = config.headers || {};
            (config.headers as any).Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          // ignore token fetch errors
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  private async handleResponse<T>(resolver: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await resolver;
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const payload = error.response?.data ?? { message: error.message };
      const status = error.response?.status ?? 500;
      return Promise.reject({ error: payload, status });
    }
  }

  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse(this.axiosInstance.get<T>(endpoint, config));
  }

  async post<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.handleResponse(this.axiosInstance.post<T, AxiosResponse<R>>(endpoint, payload, config));
  }

  async patch<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.handleResponse(this.axiosInstance.patch<T, AxiosResponse<R>>(endpoint, payload, config));
  }

  async put<T = any, R = any>(endpoint: string, payload?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.handleResponse(this.axiosInstance.put<T, AxiosResponse<R>>(endpoint, payload, config));
  }

  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse(this.axiosInstance.delete<T>(endpoint, config));
  }
}

export function configureApiService(opts?: ConfigureOpts): ApiServiceInterface {
  const baseUrl = opts?.baseUrl;
  const getToken = opts?.getToken;
  const axiosConfig = opts?.axiosConfig;

  const service = new AxiosApiService(baseUrl, getToken, axiosConfig);
  _apiService = service;
  return service;
}

// Initialize default service (no token provider, no baseUrl) so imports work out of the box.
configureApiService();
