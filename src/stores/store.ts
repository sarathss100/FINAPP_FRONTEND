import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { getTotalActiveGoalAmount, getUserGoals } from '@/service/goalService';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            login: (userData: IUser) => set(() => ({ user: { ...userData } })),
            logout: () => set(() => ({ user: null }))
        }),
        {
            name: 'user-storage'
        }
    )
);

interface Goal {
    _id: string;
    goal_name: string;
    targetAmount: number;
    currentAmount: number;
    timeframe: string;
    startDate: Date;
    endDate: Date;
}

interface GoalState {
    goals: Goal[]; // Array of goals 
    totalActiveGoalAmount: number; // Total active goal amount
    fetchGoals: () => Promise<void>; // Function to fetch goals 
    addGoal: (newGoal: Goal) => void; // Function to add a new goal
    deleteGoal: (goalId: string) => void; // Function to delete a goal by ID    
    fetchTotalActiveGoalAmount: () => Promise<void>; // Function to fetch total active goal amount
}

export const useGoalStore = create<GoalState>()(
    persist(
        (set) => ({
            goals: [], // Initial state: empty array of goals
            totalActiveGoalAmount: 0,

            // Function to fetch initial goals
            fetchGoals: async () => {
                try {
                    const response = await getUserGoals();
                    const data = await response.data;
                    set({ goals: Array.isArray(data) ? data : [data] });
1                } catch (error) {
                    console.error(`Failed to fetch goals:`, error);
                }
            },

            // Function to add a new goal
            addGoal: (newGoal: Goal) => (
                set((state) => ({
                    goals: [...state.goals, newGoal],
                }))
            ),

            // Function to delete a goal by ID 
            deleteGoal: (goalId: string) => (
                set((state) => ({
                    goals: state.goals.filter((goal) => goal._id !== goalId),
                }))
            ),

            // Function to fetch and store total active goal amount 
            fetchTotalActiveGoalAmount: async () => {
                try {
                    const response = await getTotalActiveGoalAmount();
                    const data = await response.data;
                    set({ totalActiveGoalAmount: data.totalActiveGoalAmount });
                } catch (error) {
                    console.error(`Failed to fetch goals:`, error);
                }
            }
        }),
        {
            name: 'goal-storage', // Persisted state key
        }
    )
);





