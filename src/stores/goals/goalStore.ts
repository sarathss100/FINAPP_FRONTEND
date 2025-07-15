import { getUserSocket } from "@/lib/userSocket";
import { analyzeGoal, findLongestTimePeriod, getDailyContribution, getMonthlyContribution, getTotalActiveGoalAmount, getTotalInitialGoalAmount, getUserGoals, goalsByCategory } from "@/service/goalService";
import { getToken } from "@/service/userService";
import { IGoal } from "@/types/IGoal";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    totalInitialGoalAmount: number; // Total active goal amount
    longestTimePeriod: string; // Longest Time Period acheving the goal
    smartAnalysis: IAnalysisResult | null; // SMART analysis result
    categoryByGoals: ICategoryByGoals; // Category By Goals
    dailyContribution: number; // Daily Contribution Amount 
    monthlyContribution: number; // Monthly Contribution Amount

    isConnected: boolean;
    connectionError: string | null;


    setIsConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    initializeSocket: () => void;
    disconnectSocket: () => void;

    fetchAllDataWithHttpFallback: () => Promise<void>;
    fetchAllGoals: () => Promise<void>; // Function to fetch goals 
    addGoal: (newGoal: IGoal) => void; // Function to add a new goal
    deleteGoal: (goalId: string) => void; // Function to delete a goal by ID    
    fetchTotalActiveGoalAmount: () => Promise<void>; // Function to fetch total active goal amount
    fetchTotalInitialGoalAmount: () => Promise<void>; // Function to fetch total active goal amount
    fetchLongestTimePeriod: () => Promise<void>; // Function to fetch longest time period
    fetchSmartAnalysis: () => Promise<void>; // Function to fetch SMART analysis
    fetchCategoryByGoals: () => Promise<void>; // Function to fetch Category Goals
    fetchDailyContribution: () => Promise<void>; // Function to daily contribution
    fetchMonthlyContribution: () => Promise<void>; // Functon to monthly contribution
    reset: () => void;
}

let goalsSocket: typeof Socket | null = null;

export const useGoalStore = create<GoalState>()(
    persist(
        (set, get) => ({
            goals: [], 
            totalActiveGoalAmount: 0,
            totalInitialGoalAmount: 0,
            longestTimePeriod: '',
            smartAnalysis: null, 
            categoryByGoals: {
                shortTermGoalsCurrntAmount: 0,
                shortTermGoalsTargetAmount: 0,
                mediumTermGoalsTargetAmount: 0,
                mediumTermGoalsCurrntAmount: 0,
                longTermGoalsCurrntAmount: 0,
                longTermGoalsTargetAmount: 0
            },
            dailyContribution: 0,
            monthlyContribution: 0,
            isConnected: false,
            connectionError: null,

            // Reset function
            reset: () => 
                set({
                    goals: [],
                    totalActiveGoalAmount: 0,
                    totalInitialGoalAmount: 0,
                    longestTimePeriod: '',
                    smartAnalysis: null,
                    categoryByGoals: {
                        shortTermGoalsCurrntAmount: 0,
                        shortTermGoalsTargetAmount: 0,
                        mediumTermGoalsCurrntAmount: 0,
                        mediumTermGoalsTargetAmount: 0,
                        longTermGoalsCurrntAmount: 0,
                        longTermGoalsTargetAmount: 0,
                    },
                    dailyContribution: 0,
                    monthlyContribution: 0,
                    isConnected: false,
                    connectionError: null,
                }),

            setIsConnected: (connected: boolean) => set({ isConnected: connected }),
            setConnectionError: (error: string | null) => set({ connectionError: error }),

            initializeSocket: async () => {
                try {
                    const res = await getToken();
                    if (!res.success) throw new Error("Token fetch failed");
                    const accessToken = res.data.accessToken;
            
                    const newSocket = getUserSocket(accessToken, 'goals');
            
                    // Clean up previous socket completely
                    if (goalsSocket) {
                        goalsSocket.removeAllListeners();
                        goalsSocket.disconnect();
                    }
            
                    goalsSocket = newSocket;

                    const globalDataRequest = function() {
                        newSocket.emit('request_all_goals');
                        newSocket.emit('request_categorized_goals');
                        newSocket.emit('request_longest_timeperiod');
                        newSocket.emit('request_total_active_goal_amount');
                        newSocket.emit('request_total_initial_goal_amount');
                        newSocket.emit('request_smart_analysis');
                        newSocket.emit('request_daily_contribution');
                        newSocket.emit('request_monthly_contribution');
                    }
            
                    // Setup all event listeners
                    const setupSocketListeners = () => {
                        // Connection handler
                        newSocket.on('connect', () => {
                            console.log(`Connected to Goals Server`);
                            set({ isConnected: true, connectionError: null });
                                        
                            // Request initial data after connection
                            globalDataRequest();
                        });

                        newSocket.on('new_goal_created', () => {
                            globalDataRequest();
                        });

                        newSocket.on('goal_updated', () => {
                            globalDataRequest();
                        });

                        newSocket.on('goal_removed', () => {
                            globalDataRequest();
                        });

                        // All Goal
                        newSocket.on('all_goals', (goals: IGoal[]) => {
                            set({ goals });
                        });

                        // Categorized Goals
                        newSocket.on('categorized_goals', (categoryByGoals: ICategoryByGoals) => {
                            set({ categoryByGoals });
                        });

                        // Longest Time period
                        newSocket.on('longest_timeperiod', (longestTimePeriod: string) => {
                            set({ longestTimePeriod: longestTimePeriod });
                        });

                        // Total Acitve Goal Amount
                        newSocket.on('total_active_goal_amount', (totalActiveGoalAmount: number) => {
                            set({ totalActiveGoalAmount:  totalActiveGoalAmount });
                        });

                        // Total Initial Goal Amount
                        newSocket.on('total_initial_goal_amount', (totalInitialGoalAmount: number) => {
                            set({ totalInitialGoalAmount:  totalInitialGoalAmount });
                        });

                        // Smart Goal Analysis
                        newSocket.on('smart_analysis', (smartAnalysis: IAnalysisResult) => {
                            set({ smartAnalysis:  smartAnalysis });
                        });

                        // Total Daily Contribution
                        newSocket.on('daily_contribution', (totalDailyContribution: number) => {
                            set({ dailyContribution: totalDailyContribution });
                        });

                        // Total Monthly Contribution
                        newSocket.on('monthly_contribution', (totalMonthlyContribution: number) => {
                            set({ monthlyContribution: totalMonthlyContribution });
                        });
            
                        // Handle server errors gracefully - don't disconnect socket
                        newSocket.on('error', (error: Error & { type?: string }) => {
                            console.log('Server error received:', error);
                            set({ connectionError: error.message || 'Server error occurred' });
                                        
                            // Don't disconnect socket, just fall back to HTTP for data
                            // Socket connection remains intact for future updates
                            if (error.type === 'balance_error' || error.type === 'accounts_error') {
                                console.log('Falling back to HTTP for initial data...');
                                get().fetchAllDataWithHttpFallback();
                            }
                        });            
            
                        // Disconnect
                        newSocket.on('disconnect', (reason: string) => {
                            console.log('Disconnected:', reason);
                            set({ isConnected: false });
                        });
            
                        // Connect Error - only for actual connection issues
                        newSocket.on('connect_error', (error: Error) => {
                            console.error('Goals socket connect error:', error);
                            set({ 
                                connectionError: `Connection failed: ${error.message || 'Unknown error'}`,
                                isConnected: false 
                            });
                            
                            // Fall back to HTTP data but don't give up on socket
                            get().fetchAllDataWithHttpFallback();
                        });
                    };
            
                    // Remove all existing listeners before setting up new ones
                    newSocket.removeAllListeners();
                    setupSocketListeners();

                    // If already connected, request initial data
                    if (newSocket.connected) {
                        set({ isConnected: true });
                        globalDataRequest();
                    }
            
                } catch (error) {
                    console.error("Failed to initialize goal socket:", error);
                    set({ connectionError: "Unable to fetch token. Please login again." });
                    // Still try to get data via HTTP
                    get().fetchAllDataWithHttpFallback();
                }
            },               

            disconnectSocket: () => {
                if (goalsSocket) {
                    goalsSocket.removeAllListeners();
                    goalsSocket.disconnect();
                    goalsSocket = null;
                }

                set({
                    goals: [],
                    totalActiveGoalAmount: 0,
                    totalInitialGoalAmount: 0,
                    longestTimePeriod: '',
                    smartAnalysis: null,
                    categoryByGoals: {
                        shortTermGoalsCurrntAmount: 0,
                        shortTermGoalsTargetAmount: 0,
                        mediumTermGoalsCurrntAmount: 0,
                        mediumTermGoalsTargetAmount: 0,
                        longTermGoalsCurrntAmount: 0,
                        longTermGoalsTargetAmount: 0,
                    },
                    dailyContribution: 0,
                    monthlyContribution: 0,
                    isConnected: false,
                    connectionError: null,
                });

                get().fetchAllDataWithHttpFallback();
            },

            fetchAllDataWithHttpFallback: async () => {
                try {
                    await Promise.all([
                        get().fetchAllGoals(),
                        get().fetchCategoryByGoals(),
                        get().fetchDailyContribution(),
                        get().fetchLongestTimePeriod(),
                        get().fetchMonthlyContribution(),
                        get().fetchSmartAnalysis(),
                        get().fetchTotalActiveGoalAmount(),
                        get().fetchTotalInitialGoalAmount(),
                    ]);
                    
                    // Clear connection error if HTTP fallback succeeds
                    set({ connectionError: null });
                } catch (error) {
                    console.error("HTTP fallback failed:", error);
                    // For fresh users, this is expected - just log it
                    // Don't set connection error as this is likely a fresh user scenario
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

            // Function to fetch and store total active goal amount 
            fetchTotalInitialGoalAmount: async () => {
                try {
                    const response = await getTotalInitialGoalAmount();
                    const data = await response.data;
                    set({ totalInitialGoalAmount: data.totalInitialGoalAmount });
                } catch (error) {
                    console.error(`Failed to fetch goals:`, error);
                    set({ totalInitialGoalAmount: 0 });
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
            },

            // Function to dailyContribution goals
            fetchDailyContribution: async () => {
                try {
                    const response = await getDailyContribution();
                    const data = await response.data;
                    set({ dailyContribution: data.dailyContribution });
                } catch (error) {
                    console.error(`Failed to get Daily Contribution`, error);
                    set({ dailyContribution: 0 });
                }
            },

            // Function to monthlyContribution goals
            fetchMonthlyContribution: async () => {
                try {
                    const response = await getMonthlyContribution();
                    const data = await response.data;
                    set({ monthlyContribution: data.monthlyContribution });
                } catch (error) {
                    console.error(`Failed to get Monthly Contribution`, error);
                    set({ monthlyContribution: 0 });
                }
            },
        }),
        {
            name: 'goal-storage', 
        }
    )
);