import api from './api';

export interface Statistics {
    trainings_count: number;
    nutrition_plans_count: number;
    progress_logs_count: number;
}

export const getStatistics = async () => {
    const response = await api.get('/statistics');
    return response;
}; 