export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Training {
    id: number;
    name: string;
    description: string;
    duration_minutes: number;
    category: string;
    level: 'iniciante' | 'intermediário' | 'avançado';
    finished: boolean;
    total_days: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateTraining {
    name: string;
    description: string;
    duration_minutes: number;
    category: string;
    level: 'iniciante' | 'intermediário' | 'avançado';
    finished: boolean;
    total_days: number;
}

export interface NutritionPlan {
    id: string;
    user_id: string;
    name: string;
    meal_type: 'café' | 'lanche_manha' | 'almoço' | 'lanche_tarde' | 'jantar' | 'ceia';
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Nutrition {
    id: number;
    name: string;
    description: string;
    meal_type: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateNutrition {
    name: string;
    description: string;
    meal_type: string;
}

export interface ProgressLog {
    id: number;
    training_id: number;
    days_completed: number;
    total_days: number;
    last_completed_at: string | null;
    created_at: string;
    updated_at: string;
    training?: Training;
}

export interface CreateProgressLog {
    training_id: number;
    completed_at: string;
    notes?: string;
}

export interface Progress {
    id: string;
    user_id: string;
    training_id: string;
    completed_at: string;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}
