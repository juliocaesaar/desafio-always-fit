import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NutritionPlan } from '@/types';
import { getNutritionPlans as getNutritionPlansService, getNutritionPlan as getNutritionPlanService, createNutritionPlan as createNutritionPlanService, updateNutritionPlan as updateNutritionPlanService } from '@/services/nutritionService';

export const useNutritionStore = defineStore('nutrition', () => {
    const nutritionPlans = ref<NutritionPlan[]>([]);
    const loading = ref(false);

    const fetchNutritionPlans = async () => {
        const response = await getNutritionPlansService();
        nutritionPlans.value = response.data;
    };

    const fetchNutritionPlan = async (nutritionPlanId: string) => {
        const response = await getNutritionPlanService(nutritionPlanId);
        return response.data;
    };

    const createNutritionPlan = async (nutritionPlanData: NutritionPlan) => {
        const response = await createNutritionPlanService(nutritionPlanData);
        nutritionPlans.value.push(response.data);
    };

    const updateNutritionPlan = async (nutritionPlanId: string, nutritionPlanData: NutritionPlan) => {
        const response = await updateNutritionPlanService(nutritionPlanId, nutritionPlanData);
        const index = nutritionPlans.value.findIndex(plan => plan.id === nutritionPlanId);
        if (index !== -1) {
            nutritionPlans.value[index] = response.data;
        }
    };

    return {
        nutritionPlans,
        loading,
        fetchNutritionPlans,
        fetchNutritionPlan,
        createNutritionPlan,
        updateNutritionPlan
    };
}); 