import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';
import { login as loginService, register as registerService, logout as logoutService, getUser as getUserService, updateUser as updateUserService } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('token'));
    const isAuthenticated = ref(!!localStorage.getItem('token'));

    const login = async (email: string, password: string) => {
        const response = await loginService(email, password);
        user.value = response.user;
        token.value = response.token;
        isAuthenticated.value = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
        }
    };

    const logout = async () => {
        await logoutService();
        user.value = null;
        token.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refresh_token');
    };

    const register = async (userData: User) => {
        const response = await registerService(userData);
        user.value = response.user;
        token.value = response.token;
        isAuthenticated.value = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const fetchUser = async () => {
        const response = await getUserService();
        user.value = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const updateUser = async (userData: User) => {
        const response = await updateUserService(userData);
        user.value = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const initializeAuth = async () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                user.value = JSON.parse(savedUser);
            } catch (error) {
                localStorage.removeItem('user');
            }
        }

        if (token.value && !user.value) {
            try {
                await fetchUser();
            } catch (error) {
                logout();
            }
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        register,
        fetchUser,
        updateUser,
        initializeAuth
    };
});
