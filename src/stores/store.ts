import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { analyzeGoal, findLongestTimePeriod, getDailyContribution, getMonthlyContribution, getTotalActiveGoalAmount, getUserGoals, goalsByCategory } from '@/service/goalService';
import { IGoal } from '@/types/IGoal';
import { getUserProfilePicture, getUserProfilePictureId } from '@/service/userService';
import { getTotalBalance, getTotalBankBalance, getTotalDebt, getTotalInvestment, getUserAccounts } from '@/service/accountService';
import { IAccount } from '@/types/IAccounts';
import { getAllInsurances, getInsuranceWithClosestNextPaymentDate, totalAnnualInsurancePremiumApi, totalInsuranceCoverageApi } from '@/service/insuranceService';
import { Insurance } from '@/types/IInsurance';
import useDebtStore from './debt/debtStore';
import useFaqStore from './faqs/faqStore';
import useTransactionStore from './transaction/transactionStore';
import useInvestmentStore from './investment/investmentStore';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            profilePicture: {
                image: '',
                contentType: '',
                extention: '',
            },
            login: (userData: IUser) => set(() => ({ user: { ...userData } })),
            
            // fetchtheProfileUrl
            fetchProfilePictureUrl: async () => {
              try {         
                  const response = await getUserProfilePictureId();
                  const data = await response.data;
                  const imageData = await getUserProfilePicture(data.profilePictureUrl);
                  set({ profilePicture: imageData.data });
              } catch (error) {
                  console.error(`Failed to fetch Profile Picture Url:`, error);
                  set({ profilePicture: {
                        image: '',
                        contentType: '',
                        extention: '',
                }});
              }
            }, 

            reset: () => {
                // Clear the user state
                set(() => ({ user: null }));
                set(() => ({ profilePicture: {
                    image: '',
                    contentType: '',
                    extention: '',
                }}));
            },

            logout: () => {
                // Reset the goal store 
                useGoalStore.getState().reset();

                // Reset the user store
                useUserStore.getState().reset();

                // Reset the account store 
                useAccountsStore.getState().reset();

                // Reset the transaction store
                useTransactionStore.getState().reset();

                // Reset the insurance store 
                useInsuranceStore.getState().reset();

                // Reset the debt store 
                useDebtStore.getState().reset();

                // Reset the faq store 
                useFaqStore.getState().reset();

                // Reset the investment store 
                useInvestmentStore.getState().reset();

                // Clear the persisted goal storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('goal-storage');
                }

                // Clear the persisted user storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user-storage');
                }

                // Clear the persisted transaction storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('transactions-storage');
                }

                // Clear the persisted useraccount storage 
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accounts-storage');
                }

                // Clear the persisted insurance storage 
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('insurances-storage');
                }

                // Clear the persisted faqs storage 
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('faqs-storage');
                }

                // Clear the persisted investments storage 
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('investments-storage');
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
    dailyContribution: number; // Daily Contribution Amount 
    monthlyContribution: number; // Monthly Contribution Amount
    fetchAllGoals: () => Promise<void>; // Function to fetch goals 
    addGoal: (newGoal: IGoal) => void; // Function to add a new goal
    deleteGoal: (goalId: string) => void; // Function to delete a goal by ID    
    fetchTotalActiveGoalAmount: () => Promise<void>; // Function to fetch total active goal amount
    fetchLongestTimePeriod: () => Promise<void>; // Function to fetch longest time period
    fetchSmartAnalysis: () => Promise<void>; // Function to fetch SMART analysis
    fetchCategoryByGoals: () => Promise<void>; // Function to fetch Category Goals
    fetchDailyContribution: () => Promise<void>; // Function to daily contribution
    fetchMonthlyContribution: () => Promise<void>; // Functon to monthly contribution
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
            dailyContribution: 0,
            monthlyContribution: 0,

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
                    },
                    dailyContribution: 0,
                    monthlyContribution: 0,
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
            name: 'goal-storage', // Persisted state key
        }
    )
);

interface AccountState {
    totalBalance: number; // Total account balance
    totalBankBalance: number; // Total bank account balance
    totalDebt: number; // Total total debt
    totalInvestment: number; // Total investment
    bankAccounts: IAccount[]; // bankAccount Details
    investmentAccounts: IAccount[]; // investmentAccount Details 
    debtAccounts: IAccount[]; // debt Account Details
    liquidAccounts: IAccount[]; // liquid Account Details
    fetchTotalBalance: () => Promise<void>; // Function to fetch total active goal amount
    fetchTotalBankBalance: () => Promise<void>; // Function to fetch total Bank Balance
    fetchTotalDebt: () => Promise<void>; // Function to fetch total Debt
    fetchTotalInvestment: () => Promise<void>; // Function to fetch total Investment
    fetchAllAccounts: () => Promise<void>; // Function to fetch all account details 
    reset: () => void;
}

export const useAccountsStore = create<AccountState>()(
    persist(
        (set) => ({
            totalBalance: 0,
            totalBankBalance: 0,
            totalDebt: 0,
            totalInvestment: 0,
            bankAccounts: [],
            investmentAccounts: [],
            debtAccounts: [],
            liquidAccounts: [],

            // Reset function
            reset: () => 
                set({
                    totalBalance: 0,
                    totalBankBalance: 0,
                    totalDebt: 0,
                    totalInvestment: 0,
                    bankAccounts: [],
                    investmentAccounts: [],
                    debtAccounts: [],
                    liquidAccounts: [],
                }),
            
            // fetch Total Balance 
            fetchTotalBalance: async () => {
                try {
                    const response = await getTotalBalance();
                    const data = await response.data;
                    set({ totalBalance: data.totalBalance });
                } catch (error) {
                    console.error(`Failed to get total Balance`, error);
                    set({ totalBalance: 0 });
                }
            },

            // fetch Total Bank Balance
            fetchTotalBankBalance: async () => {
                try {
                    const response = await getTotalBankBalance();
                    const data = await response.data;
                    set({ totalBankBalance: data.totalBankBalance });
                } catch (error) {
                    console.error(`Failed to get total Bank Balance`, error);
                    set({ totalBankBalance: 0 });
                }
            },

            // fetch Total Debt 
            fetchTotalDebt: async () => {
                try {
                    const response = await getTotalDebt();
                    const data = await response.data;
                    set({ totalDebt: data.totalDebt });
                } catch (error) {
                    console.error(`Failed to get total Debt`, error);
                    set({ totalDebt: 0 });
                }
            },

            // fetch Total Investment
            fetchTotalInvestment: async () => {
                try {
                    const response = await getTotalInvestment();
                    const data = await response.data;
                    set({ totalInvestment: data.totalInvestment });
                } catch (error) {
                    console.error(`Failed to get total Investment`, error);
                    set({ totalInvestment: 0 });
                }
            },

            fetchAllAccounts: async () => {
                try {
                    const response = await getUserAccounts();
                    const data = await response.data;
                    const accountDetails = Object.values(data);
                    const bankAccounts = accountDetails.filter((account) => account.account_type === 'Bank');
                    const investmentAccounts = accountDetails.filter((account) => account.account_type === 'Investment');
                    const debtAccounts = accountDetails.filter((account) => account.account_type === 'Debt');
                    const liquidAccounts = accountDetails.filter((account) => account.account_type === 'Cash');

                    set({ bankAccounts: bankAccounts });
                    set({ investmentAccounts: investmentAccounts });
                    set({ debtAccounts: debtAccounts });
                    set({ liquidAccounts: liquidAccounts });
                } catch (error) {
                    console.error(`Failed to get all accounts`, error);
                    set({ bankAccounts: [] });
                    set({ investmentAccounts: [] });
                    set({ debtAccounts: [] });
                    set({ liquidAccounts: [] });
                }
            }
        }),
        {
            name: 'accounts-storage', // Persisted state key
        }
    )
);

interface InsuranceState {
    totalInsuranceCoverage: number; // Total active insurance coverage 
    totalAnnualInsurancePremium: number; // Total annual insurance premium 
    allInsurances: Insurance[]; // All Insurances 
    insuranceWithClosestNextPaymentDate: Insurance; // Insurance with closest next payment date 
    fetchTotalInsuranceCoverage: () => Promise<void>; // Function to fetch Total Insurance Coverage 
    fetchTotalAnnualInsurancePremium: () => Promise<void>; // Function to fetch Total Annual Insurance Premium 
    fetchAllInsurances: () => Promise<void>; // Function to fetch All Insurances
    fetchInsuranceWithClosestNextPaymentDate: () => Promise<void>; // Function to fetch insurance with closest next payment date 
    reset: () => void;
}

export const useInsuranceStore = create<InsuranceState>()(
    persist(
        (set) => ({
            totalInsuranceCoverage: 0,
            totalAnnualInsurancePremium: 0,
            allInsurances: [],
            insuranceWithClosestNextPaymentDate: {
                _id: '',
                userId: '',
                type: '',
                coverage: 0,
                premium: 0,
                next_payment_date: new Date(),
                payment_status: '',
                status: '',
            },

            // Reset function
            reset: () => 
                set({
                    totalInsuranceCoverage: 0,
                    totalAnnualInsurancePremium: 0,
                    allInsurances: [],
                    insuranceWithClosestNextPaymentDate: {
                        _id: '',
                        userId: '',
                        type: '',
                        coverage: 0,
                        premium: 0,
                        next_payment_date: new Date(),
                        payment_status: '',
                        status: '',
                    },
                }),
            
            // fetch Total Insurance Coverage
            fetchTotalInsuranceCoverage: async () => {
                try {
                    const response = await totalInsuranceCoverageApi();
                    const data = await response.data;
                    set({ totalInsuranceCoverage: data.totalInsuranceCoverage });
                } catch (error) {
                    console.error(`Failed to get total insurance coverage`, error);
                    set({ totalInsuranceCoverage: 0 });
                }
            },

            // fetch Annual total premium
            fetchTotalAnnualInsurancePremium: async () => {
                try {
                    const response = await totalAnnualInsurancePremiumApi();
                    const data = await response.data;
                    set({ totalAnnualInsurancePremium: data.totalPremium });
                } catch (error) {
                    console.error(`Failed to get annual total premium`, error);
                    set({ totalAnnualInsurancePremium: 0 });
                }
            },

            // Fetches all insurance records for the authenticated user
            fetchAllInsurances: async () => {
                try {
                    const response = await getAllInsurances();
                    const data = await response.data;
                    set({ allInsurances: data.insuranceDetails });
                } catch (error) {
                    console.error('Failed to fetch all insurance records', error);
                    set({ allInsurances: [] });
                }
            },

            // Fetches all insurance records for the authenticated user
            fetchInsuranceWithClosestNextPaymentDate: async () => {
                try {
                    const response = await getInsuranceWithClosestNextPaymentDate();
                    const data = await response.data;
                    set({ insuranceWithClosestNextPaymentDate: data.insurance });
                } catch (error) {
                    console.error('Failed to fetch all insurance records', error);
                    set({ insuranceWithClosestNextPaymentDate: {
                        _id: '',
                        userId: '',
                        type: '',
                        coverage: 0,
                        premium: 0,
                        next_payment_date: new Date(),
                        payment_status: '',
                        status: '',
                    }});
                }
            },
        }),
        {
            name: 'insurances-storage', // Persisted state key
        }
    )
);
