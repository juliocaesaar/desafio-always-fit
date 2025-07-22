import axios from 'axios';
import { refreshToken } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            const refresh_token = localStorage.getItem('refresh_token');
            if (refresh_token) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return api(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
                originalRequest._retry = true;
                isRefreshing = true;
                try {
                    const response = await refreshToken();
                    const newToken = response.token;
                    localStorage.setItem('token', newToken);
                    if (response.refresh_token) {
                        localStorage.setItem('refresh_token', response.refresh_token);
                    }
                    api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                    processQueue(null, newToken);
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                    return api(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
