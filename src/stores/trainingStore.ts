import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Training } from '@/types';
import { getTrainings as getTrainingsService, getTraining as getTrainingService, createTraining as createTrainingService, updateTraining as updateTrainingService } from '@/services/trainingService';

export const useTrainingStore = defineStore('training', () => {
    const trainings = ref<Training[]>([]);
    const loading = ref(false);

    const fetchTrainings = async () => {
        const response = await getTrainingsService();
        trainings.value = response.data;
    };

    const fetchTraining = async (trainingId: string) => {
        const response = await getTrainingService(trainingId);
        return response.data;
    };

    const createTraining = async (trainingData: Training) => {
        const response = await createTrainingService(trainingData);
        trainings.value.push(response.data);
    };

    const updateTraining = async (trainingId: string, trainingData: Training) => {
        const response = await updateTrainingService(trainingId, trainingData);
        const index = trainings.value.findIndex(training => training.id === Number(trainingId));
        if (index !== -1) {
            trainings.value[index] = response.data;
        }
    };

    return {
        trainings,
        loading,
        fetchTrainings,
        fetchTraining,
        createTraining,
        updateTraining
    };
});
