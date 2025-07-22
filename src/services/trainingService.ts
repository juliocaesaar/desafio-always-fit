import api from './api';
import type { Training, CreateTraining } from '../types';

const baseUrl = '/trainings';

export const getTrainings = async () => {
    const response = await api.get(baseUrl);
    return response.data;
};

export const getTraining = async (trainingId: string) => {
    const response = await api.get(`${baseUrl}/${trainingId}`);
    return response.data;
};

export const createTraining = async (trainingData: CreateTraining) => {
    const response = await api.post(baseUrl, trainingData);
    return response.data;
};

export const updateTraining = async (trainingId: string, trainingData: Training) => {
    const response = await api.put(`${baseUrl}/${trainingId}`, trainingData);
    return response.data;
};

export const deleteTraining = async (trainingId: number) => {
    const response = await api.delete(`${baseUrl}/${trainingId}`);
    return response.data;
};