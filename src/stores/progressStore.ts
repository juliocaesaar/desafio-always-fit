import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ProgressLog } from '@/types';
import { getProgressLogs as getProgressLogsService, getProgressLog as getProgressLogService, createProgressLog as createProgressLogService, updateProgressLog as updateProgressLogService } from '@/services/progressService';

export const useProgressStore = defineStore('progress', () => {
    const progressLogs = ref<ProgressLog[]>([]);
    const loading = ref(false);

    const fetchProgressLogs = async () => {
        const response = await getProgressLogsService();
        progressLogs.value = response.data;
    };

    const fetchProgressLog = async (progressLogId: string) => {
        const response = await getProgressLogService(progressLogId);
        return response.data;
    };

    const createProgressLog = async (progressLogData: ProgressLog) => {
        const response = await createProgressLogService(progressLogData);
        progressLogs.value.push(response.data);
    };

    const updateProgressLog = async (progressLogId: string, progressLogData: ProgressLog) => {
        const response = await updateProgressLogService(progressLogId, progressLogData);
        const index = progressLogs.value.findIndex(log => log.id === progressLogId);
        if (index !== -1) {
            progressLogs.value[index] = response.data;
        }
    };

    return {
        progressLogs,
        loading,
        fetchProgressLogs,
        fetchProgressLog,
        createProgressLog,
        updateProgressLog
    };
}); 