import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { analyzeGoal, findLongestTimePeriod, getDailyContribution, getMonthlyContribution, getTotalActiveGoalAmount, getUserGoals, goalsByCategory } from '@/service/goalService';
import { IGoal } from '@/types/IGoal';
import { getUserProfilePictureUrl } from '@/service/userService';
import { getTotalBalance, getTotalBankBalance, getTotalDebt, getTotalInvestment, getUserAccounts } from '@/service/accountService';
import { IAccount } from '@/types/IAccounts';
import { fetchInflowTable, getAllIncomeTransactions, getAllTransactions, getCategoryWiseExpenses, getMonthlyIncomeTrends, getTotalMonthlyExpense, getTotalMonthlyIncome } from '@/service/transactionService';
import { ITransaction } from '@/types/ITransaction';
import { getAllInsurances, getInsuranceWithClosestNextPaymentDate, totalAnnualInsurancePremiumApi, totalInsuranceCoverageApi } from '@/service/insuranceService';
import { Insurance } from '@/types/IInsurance';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            profilePictureUrl: './user.png',
            login: (userData: IUser) => set(() => ({ user: { ...userData } })),
            
            // fetchtheProfileUrl
            fetchProfilePictureUrl: async () => {
              try {         
                const response = await getUserProfilePictureUrl();
                  const data = await response.data;
                  set({ profilePictureUrl: data.profilePictureUrl });
              } catch (error) {
                  console.error(`Failed to fetch Profile Picture Url:`, error);
                  set({ profilePictureUrl: './user.png' });
              }
            }, 

            // updteProfilePictureUrl
            updateProfilePictureUrl: (url: string) => {
                set({ profilePictureUrl: url });
            },

            reset: () => {
                // Clear the user state
                set(() => ({ user: null }));
                set(() => ({ profilePictureUrl: '' }));
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

interface TransactionState {
    currentMonthTotalIncome: number; // Current Month Total Income
    previousMonthTotalIncome: number; // Previous Month Total Income
    currentMonthTotalExpense: number; // Current Month Total Expense
    categoryWiseMonthlyExpense: { category: string, value: number }[]; // Current Month Category Wise expense
    allTransactions: ITransaction[]; // All Transactions 
    monthlyIncomeTrends: { month: string, amount: number }[];
    allIncomeTransactions: { category: string, total: number }[]; // All Income Transactions
    inflowTable: { data: ITransaction[], total: number, currentPage: number, totalPages: number }; // All Transactions to show in table 
    
    // New filter states
    inflowFilters: {
        page: number;
        limit: number;
        timeRange: string;
        category: string;
        searchText: string;
    };
    isLoadingInflowTable: boolean;
    
    fetchMonthlyTotalIncome: () => Promise<void>; // Function to fetch Monthly Total Income
    fetchMonthlyTotalExpense: () => Promise<void>; // Function to fetch Monthly Total Expense 
    fetchCategoryWiseExpenses: () => Promise<void>; // Function to fetch Category Wise Monthly Expenses 
    fetchAllTransactions: () => Promise<void>; // Function to fetch all transactions 
    fetchMonthlyIncomeTrends: () => Promise<void>; // Function to fetch Monthly Income Trends
    fetchAllIncomeTransactions: () => Promise<void>; // Function to fetch all income transactions 
    fetchTableInflow: () => Promise<void>; // Function to fetch Table Inflow
    
    // New filter actions
    setInflowPage: (page: number) => void;
    setInflowLimit: (limit: number) => void;
    setInflowTimeRange: (timeRange: string) => void;
    setInflowCategory: (category: string) => void;
    setInflowSearchText: (searchText: string) => void;
    clearInflowFilters: () => void;
    goToNextInflowPage: () => void;
    goToPrevInflowPage: () => void;
    
    reset: () => void;
}

export const useTransactionStore = create<TransactionState>()(
    persist(
        (set, get) => ({
            currentMonthTotalIncome: 0,
            previousMonthTotalIncome: 0,
            currentMonthTotalExpense: 0,
            categoryWiseMonthlyExpense: [],
            allTransactions: [],
            monthlyIncomeTrends: [],
            allIncomeTransactions: [],
            inflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1},
            
            // New filter states
            inflowFilters: {
                page: 1,
                limit: 10,
                timeRange: 'year',
                category: '',
                searchText: '',
            },
            isLoadingInflowTable: false,

            // Reset function
            reset: () => 
                set({
                    currentMonthTotalIncome: 0,
                    previousMonthTotalIncome: 0,
                    currentMonthTotalExpense: 0,
                    categoryWiseMonthlyExpense: [],
                    allTransactions: [],
                    monthlyIncomeTrends: [],
                    allIncomeTransactions: [],
                    inflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1},
                    inflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    },
                    isLoadingInflowTable: false,
                }),
            
            // fetch Total Balance 
            fetchMonthlyTotalIncome: async () => {
                try {
                    const response = await getTotalMonthlyIncome();
                    const data = await response.data;
                    set({ currentMonthTotalIncome: data.currentMonthTotal });
                    set({ previousMonthTotalIncome: data.previousMonthTotal });
                } catch (error) {
                    console.error(`Failed to get total Monthly Income`, error);
                    set({ currentMonthTotalIncome: 0 });
                    set({ previousMonthTotalIncome: 0 });
                }
            },

            // fetch Total Expense
            fetchMonthlyTotalExpense: async () => {
                try {
                    const response = await getTotalMonthlyExpense();
                    const data = await response.data;
                    set({ currentMonthTotalExpense: data.totalMonthlyExpense });
                } catch (error) {
                    console.error(`Failed to get total Monthly Expense`, error);
                    set({ currentMonthTotalExpense: 0 });
                }
            },

            // fetch Category Wise Expenses 
            fetchCategoryWiseExpenses: async () => {
                try {
                    const response = await getCategoryWiseExpenses();
                    const data = await response.data;
                    set({ categoryWiseMonthlyExpense: data.categoryWiseExpenses});
                } catch (error) {
                    console.error(`Failed to get total Monthly Expense`, error);
                    set({ categoryWiseMonthlyExpense: [] });
                }
            },

            // fetch All Transactions 
            fetchAllTransactions: async () => {
                try {
                    const response = await getAllTransactions();
                    const data = await response.data;
                    set({ allTransactions: data.allTransactions });
                } catch (error) {
                    console.error(`Failed to get total Monthly Expense`, error);
                    set({ allTransactions: [] });
                } 
            },

            // fetch Monthly Income Trends 
            fetchMonthlyIncomeTrends: async () => {
                try {
                    const response = await getMonthlyIncomeTrends();
                    const data = await response.data;
                    console.log(`Successfully get data from backend:`, data.transactions);
                    set({ monthlyIncomeTrends: data.transactions });
                } catch (error) {
                    console.error(`Failed to get Monthly Trends`, error);
                    set({ monthlyIncomeTrends: [] });
                }
            },

            // fetch All Income Transactions 
            fetchAllIncomeTransactions: async () => {
                try {
                    const response = await getAllIncomeTransactions();
                    const data = await response.data;
                    set({ allIncomeTransactions: data.transactions });
                } catch (error) {
                    console.error(`Failed to get total transaction`, error);
                    set({ allIncomeTransactions: [] });
                } 
            },

            // Updated fetch All Inflow Table with filters
            fetchTableInflow: async () => {
                try {
                    set({ isLoadingInflowTable: true });
                    await new Promise(resolve => setTimeout(resolve, 250));
                    const { inflowFilters } = get();
                    
                    const response = await fetchInflowTable(
                        inflowFilters.page,
                        inflowFilters.limit,
                        inflowFilters.timeRange,
                        inflowFilters.category || undefined,
                        inflowFilters.searchText || undefined
                    );
                    
                    const data = response.data;
                    set({ inflowTable: data.transactions });
                } catch (error) {
                    console.error(`Failed to get inflow table`, error);
                    set({ inflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1} });
                } finally {
                    set({ isLoadingInflowTable: false });
                }
            },

            // New filter actions
            setInflowPage: (page: number) => {
                set(state => ({
                    inflowFilters: { ...state.inflowFilters, page }
                }));
                // Auto-fetch when page changes
                setTimeout(() => get().fetchTableInflow(), 0);
            },

            setInflowLimit: (limit: number) => {
                set(state => ({
                    inflowFilters: { ...state.inflowFilters, limit, page: 1 } // Reset to page 1 when limit changes
                }));
                // Auto-fetch when limit changes
                setTimeout(() => get().fetchTableInflow(), 0);
            },

            setInflowTimeRange: (timeRange: string) => {
                set(state => ({
                    inflowFilters: { ...state.inflowFilters, timeRange, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when timeRange changes
                setTimeout(() => get().fetchTableInflow(), 0);
            },

            setInflowCategory: (category: string) => {
                set(state => ({
                    inflowFilters: { ...state.inflowFilters, category, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when category changes
                setTimeout(() => get().fetchTableInflow(), 0);
            },

            setInflowSearchText: (searchText: string) => {
                set(state => ({
                    inflowFilters: { ...state.inflowFilters, searchText, page: 1 } // Reset to page 1 when search changes
                }));
                // Auto-fetch when search changes (you might want to debounce this)
                setTimeout(() => get().fetchTableInflow(), 0);
            },

            clearInflowFilters: () => {
                set({
                    inflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    }
                });
                // Auto-fetch when filters are cleared
                setTimeout(() => get().fetchTableInflow(), 0);
            },

            goToNextInflowPage: () => {
                const { inflowTable, inflowFilters } = get();
                if (inflowFilters.page < inflowTable.totalPages) {
                    get().setInflowPage(inflowFilters.page + 1);
                }
            },

            goToPrevInflowPage: () => {
                const { inflowFilters } = get();
                if (inflowFilters.page > 1) {
                    get().setInflowPage(inflowFilters.page - 1);
                }
            },
        }),
        {
            name: 'transactions-storage', // Persisted state key
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
