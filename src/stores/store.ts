import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { analyzeGoal, findLongestTimePeriod, getTotalActiveGoalAmount, getUserGoals, goalsByCategory } from '@/service/goalService';
import { IGoal } from '@/types/IGoal';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            login: (userData: IUser) => set(() => ({ user: { ...userData } })),
            logout: () => {
                // Reset the goal store 
                useGoalStore.getState().reset();

                // Clear the persisted goal storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('goal-storage');
                }
                
                // Clear the user state
                set(() => ({ user: null }))

                // Clear the persisted user storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user-storage');
                }
            } 
        }),
        {
            name: 'user-storage'
        }
    )
);

export interface IAnalysisResult {
    isSmartCompliant: boolean;
    feedback: {
        Overall: string;
        [key: string]: string;
    };
    suggestions: string[];
    totalScore: number;
    criteriaScores: {
        specific: number;
        measurable: number;
        achievable: number;
        relevant: number;
        timeBound: number;
        [key: string]: number;
    };
}

interface ICategoryByGoals {
    shortTermGoalsCurrntAmount: number; 
    shortTermGoalsTargetAmount: number; 
    mediumTermGoalsCurrntAmount: number; 
    mediumTermGoalsTargetAmount: number; 
    longTermGoalsCurrntAmount: number; 
    longTermGoalsTargetAmount: number; 
}

interface GoalState {
    goals: IGoal[]; // Array of goals 
    totalActiveGoalAmount: number; // Total active goal amount
    longestTimePeriod: string; // Longest Time Period acheving the goal
    smartAnalysis: IAnalysisResult | null; // SMART analysis result
    categoryByGoals: ICategoryByGoals; // Category By Goals
    fetchAllGoals: () => Promise<void>; // Function to fetch goals 
    addGoal: (newGoal: IGoal) => void; // Function to add a new goal
    deleteGoal: (goalId: string) => void; // Function to delete a goal by ID    
    fetchTotalActiveGoalAmount: () => Promise<void>; // Function to fetch total active goal amount
    fetchLongestTimePeriod: () => Promise<void>; // Function to fetch longest time period
    fetchSmartAnalysis: () => Promise<void>; // Function to fetch SMART analysis
    fetchCategoryByGoals: () => Promise<void>;
    reset: () => void;
}

export const useGoalStore = create<GoalState>()(
    persist(
        (set) => ({
            goals: [], // Initial state: empty array of goals
            totalActiveGoalAmount: 0,
            longestTimePeriod: '',
            smartAnalysis: null, // Initial SMART analysis state
            categoryByGoals: {
                shortTermGoalsCurrntAmount: 0,
                shortTermGoalsTargetAmount: 0,
                mediumTermGoalsTargetAmount: 0,
                mediumTermGoalsCurrntAmount: 0,
                longTermGoalsCurrntAmount: 0,
                longTermGoalsTargetAmount: 0
            },

            // Reset function
            reset: () => 
                set({
                    goals: [],
                    totalActiveGoalAmount: 0,
                    longestTimePeriod: '',
                    smartAnalysis: null,
                    categoryByGoals: {
                        shortTermGoalsCurrntAmount: 0,
                        shortTermGoalsTargetAmount: 0,
                        mediumTermGoalsCurrntAmount: 0,
                        mediumTermGoalsTargetAmount: 0,
                        longTermGoalsCurrntAmount: 0,
                        longTermGoalsTargetAmount: 0,
                    }
                }),

            // In your store.ts file, update the fetchSmartAnalysis function:
            fetchSmartAnalysis: async () => {
              try {         
                const response = await analyzeGoal();
                  const data = await response.data;
                  set({ smartAnalysis: data }); // Store the complete SMART analysis result
              } catch (error) {
                  console.error(`Failed to fetch SMART analysis:`, error);
                  set({ smartAnalysis: null });
              }
            },

            // Function to add a new goal
            addGoal: (newGoal: IGoal) => (
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
                    set({ totalActiveGoalAmount: 0 });
                }
            },

            // Function to fetch and store longest goal target date
            fetchLongestTimePeriod: async () => {
                try {
                    const response = await findLongestTimePeriod();
                    const data = await response.data;
                    set({ longestTimePeriod: data.longestTimePeriod});
                } catch (error) {
                    console.error(`Failed to fetch the longest time period`, error);
                    set({ longestTimePeriod: `0 Y 0 M 0 D` });
                }
            },

            // Function to fetch goals by Category 
            fetchCategoryByGoals: async () => {
                try {
                    const response = await goalsByCategory();
                    const data = await response.data;
                    set({ categoryByGoals: data.goalsByCategory });
                } catch (error) {
                    console.error(`Failed to get the goal by category`, error);
                    set({
                        categoryByGoals: {
                        shortTermGoalsCurrntAmount: 0,
                        shortTermGoalsTargetAmount: 0,
                        mediumTermGoalsCurrntAmount: 0,
                        mediumTermGoalsTargetAmount: 0,
                        longTermGoalsCurrntAmount: 0,
                        longTermGoalsTargetAmount: 0,
                    }})
                }
            },

            // Function to fetch all goals 
            fetchAllGoals: async () => {
                try {
                    const response = await getUserGoals();
                    const data = await response.data;
                    set({ goals: data });
                } catch (error) {
                    console.error(`Failed to get all goals`, error);
                    set({ goals: [] });
                }
            }
        }),
        {
            name: 'goal-storage', // Persisted state key
        }
    )
);





