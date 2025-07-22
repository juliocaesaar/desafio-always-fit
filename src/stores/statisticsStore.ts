import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Statistics } from '@/services/statisticsService';
import { getStatistics as getStatisticsService } from '@/services/statisticsService';

export const useStatisticsStore = defineStore('statistics', () => {
    const statistics = ref<Statistics | null>(null);
    const loading = ref(false);

    const fetchStatistics = async () => {
        loading.value = true;
        try {
            const response = await getStatisticsService();
            if (response.data && response.data.statistics) {
                statistics.value = response.data.statistics;
            }
        } catch (error) {
        } finally {
            loading.value = false;
        }
    };

    return {
        statistics,
        loading,
        fetchStatistics
    };
}); 