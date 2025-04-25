import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { analyzeGoal, findLongestTimePeriod, getTotalActiveGoalAmount, getUserGoals } from '@/service/goalService';

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

interface GoalState {
    goals: Goal[]; // Array of goals 
    totalActiveGoalAmount: number; // Total active goal amount
    longestTimePeriod: string; // Longest Time Period acheving the goal
    smartAnalysis: IAnalysisResult | null; // SMART analysis result
    fetchGoals: () => Promise<void>; // Function to fetch goals 
    addGoal: (newGoal: Goal) => void; // Function to add a new goal
    deleteGoal: (goalId: string) => void; // Function to delete a goal by ID    
    fetchTotalActiveGoalAmount: () => Promise<void>; // Function to fetch total active goal amount
    fetchLongestTimePeriod: () => Promise<void>; // Function to fetch longest time period
    fetchSmartAnalysis: () => Promise<void>; // Function to fetch SMART analysis
}

export const useGoalStore = create<GoalState>()(
    persist(
        (set) => ({
            goals: [], // Initial state: empty array of goals
            totalActiveGoalAmount: 0,
            longestTimePeriod: '',
            smartAnalysis: null, // Initial SMART analysis state

            // Function to fetch initial goals
            fetchGoals: async () => {
                try {
                    const response = await getUserGoals();
                    const data = await response.data;
                    set({ goals: Array.isArray(data) ? data : [data] });
                } catch (error) {
                    console.error(`Failed to fetch goals:`, error);
                }
            },

            // In your store.ts file, update the fetchSmartAnalysis function:
            fetchSmartAnalysis: async () => {
              try {         
                const response = await analyzeGoal();
                const data = await response.data;
                set({ smartAnalysis: data }); // Store the complete SMART analysis result
              } catch (error) {
                console.error(`Failed to fetch SMART analysis:`, error);
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
            },

            // Function to fetch and store longest goal target date
            fetchLongestTimePeriod: async () => {
                try {
                    const response = await findLongestTimePeriod();
                    const data = await response.data;
                    set({ longestTimePeriod: data.longestTimePeriod});
                } catch (error) {
                    console.error(`Failed to fetch the longest time period`, error);
                }
            }
        }),
        {
            name: 'goal-storage', // Persisted state key
        }
    )
);





