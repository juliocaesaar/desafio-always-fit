import api from './api';
import type { Nutrition, CreateNutrition } from '../types';

const baseUrl = '/nutrition-plans';

export const getNutritionPlans = async () => {
    const response = await api.get(baseUrl);
    return response.data;
};

export const getNutritionPlan = async (nutritionId: string) => {
    const response = await api.get(`${baseUrl}/${nutritionId}`);
    return response.data;
};

export const createNutritionPlan = async (nutritionData: CreateNutrition) => {
    const response = await api.post(baseUrl, nutritionData);
    return response.data;
};

export const updateNutritionPlan = async (nutritionId: string, nutritionData: Nutrition) => {
    const response = await api.put(`${baseUrl}/${nutritionId}`, nutritionData);
    return response.data;
};

export const deleteNutritionPlan = async (nutritionId: string) => {
    const response = await api.delete(`${baseUrl}/${nutritionId}`);
    return response.data;
};