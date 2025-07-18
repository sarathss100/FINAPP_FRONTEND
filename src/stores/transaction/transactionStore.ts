import { ITransaction } from '@/types/ITransaction';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchCommonflowTable, fetchInflowTable, fetchOutflowTable, getAllExpenseTransactions, getAllIncomeTransactions, getAllTransactions, getCategoryWiseExpenses, getMonthlyExpenseTrends, getMonthlyIncomeTrends, getTotalMonthlyExpense, getTotalMonthlyIncome } from '@/service/transactionService';
import { Socket } from 'socket.io-client';
import { getToken } from '@/service/userService';
import { getUserSocket } from '@/lib/userSocket';

interface TransactionState {
    currentMonthTotalIncome: number; // Current Month Total Income
    previousMonthTotalIncome: number; // Previous Month Total Income
    currentMonthTotalExpense: number; // Current Month Total Expense
    previousMonthTotalExpense: number; // Previous Month Total Expense
    categoryWiseMonthlyExpense: { category: string, value: number }[]; // Current Month Category Wise expense
    allTransactions: ITransaction[]; // All Transactions 
    monthlyIncomeTrends: { month: string, amount: number }[];
    monthlyExpenseTrends: { month: string, amount: number }[];
    allIncomeTransactions: { category: string, total: number }[]; // All Income Transactions
    allExpenseTransactions: { category: string, total: number }[]; // All Expense Transactions
    inflowTable: { data: ITransaction[], total: number, currentPage: number, totalPages: number }; // All Transactions to show in table 
    OutflowTable: { data: ITransaction[], total: number, currentPage: number, totalPages: number }; // All Transactions to show in table 
    commonflowTable: { data: ITransaction[], total: number, currentPage: number, totalPages: number }; // All Transactions to show in table
    
    // New filter states
    inflowFilters: {
        page: number;
        limit: number;
        timeRange: string;
        category: string;
        searchText: string;
    };
    isLoadingInflowTable: boolean;

    // New filter states
    OutflowFilters: {
        page: number;
        limit: number;
        timeRange: string;
        category: string;
        searchText: string;
    };
    isLoadingOutflowTable: boolean;

    // New filter states
    commonflowFilters: {
        page: number;
        limit: number;
        timeRange: string;
        category: string;
        transactionType: string;
        searchText: string;
    };
    isLoadingCommonflowTable: boolean;

    isConnected: boolean;
    connectionError: string | null;

    setIsConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    initializeSocket: () => void;
    disconnectSocket: () => void;

    fetchAllDataWithHttpFallback: () => Promise<void>;
    fetchMonthlyTotalIncome: () => Promise<void>; // Function to fetch Monthly Total Income
    fetchMonthlyTotalExpense: () => Promise<void>; // Function to fetch Monthly Total Expense 
    fetchCategoryWiseExpenses: () => Promise<void>; // Function to fetch Category Wise Monthly Expenses 
    fetchAllTransactions: () => Promise<void>; // Function to fetch all transactions 
    fetchMonthlyIncomeTrends: () => Promise<void>; // Function to fetch Monthly Income Trends
    fetchMonthlyExpenseTrends: () => Promise<void>; // Function to fetch Monthly Expense Trends
    fetchAllIncomeTransactions: () => Promise<void>; // Function to fetch all income transactions 
    fetchAllExpenseTransactions: () => Promise<void>; // Function to fetch all expense transactions 
    fetchTableInflow: () => Promise<void>; // Function to fetch Table Inflow
    fetchTableOutflow: () => Promise<void>; // Function to fetch Table Outflow
    fetchTableCommonflow: () => Promise<void>; // Function to fetch Table Commonflow
    
    // New filter actions
    setInflowPage: (page: number) => void;
    setInflowLimit: (limit: number) => void;
    setInflowTimeRange: (timeRange: string) => void;
    setInflowCategory: (category: string) => void;
    setInflowSearchText: (searchText: string) => void;
    clearInflowFilters: () => void;
    goToNextInflowPage: () => void;
    goToPrevInflowPage: () => void;

    // New filter actions
    setOutflowPage: (page: number) => void;
    setOutflowLimit: (limit: number) => void;
    setOutflowTimeRange: (timeRange: string) => void;
    setOutflowCategory: (category: string) => void;
    setOutflowSearchText: (searchText: string) => void;
    clearOutflowFilters: () => void;
    goToNextOutflowPage: () => void;
    goToPrevOutflowPage: () => void;

    // New filter actions
    setCommonflowPage: (page: number) => void;
    setCommonflowLimit: (limit: number) => void;
    setCommonflowTimeRange: (timeRange: string) => void;
    setCommonflowCategory: (category: string) => void;
    setCommonflowTransactionType: (transactionType: string) => void;
    setCommonflowSearchText: (searchText: string) => void;
    clearCommonflowFilters: () => void;
    goToNextCommonflowPage: () => void;
    goToPrevCommonflowPage: () => void;
    
    reset: () => void;
}

let transactionSocket: typeof Socket | null = null;

const useTransactionStore = create<TransactionState>()(
    persist(
        (set, get) => ({
            currentMonthTotalIncome: 0,
            previousMonthTotalIncome: 0,
            currentMonthTotalExpense: 0,
            previousMonthTotalExpense: 0,
            categoryWiseMonthlyExpense: [],
            allTransactions: [],
            monthlyIncomeTrends: [],
            monthlyExpenseTrends: [],
            allIncomeTransactions: [],
            allExpenseTransactions: [],
            inflowTable: { data: [], total: 0, currentPage: 1, totalPages: 1 },
            OutflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1},
            commonflowTable: { data: [], total: 0, currentPage: 1, totalPages: 1 },
            
            // New filter states
            inflowFilters: {
                page: 1,
                limit: 10,
                timeRange: 'year',
                category: '',
                searchText: '',
            },
            isLoadingInflowTable: false,

            // New filter states
            OutflowFilters: {
                page: 1,
                limit: 10,
                timeRange: 'year',
                category: '',
                searchText: '',
            },
            isLoadingOutflowTable: false,

            // New filter states
            commonflowFilters: {
                page: 1,
                limit: 10,
                timeRange: 'year',
                category: '',
                transactionType: '',
                searchText: '',
            },
            isLoadingCommonflowTable: false,
            isConnected: false,
            connectionError: null,

            // Reset function
            reset: () => 
                set({
                    currentMonthTotalIncome: 0,
                    previousMonthTotalIncome: 0,
                    currentMonthTotalExpense: 0,
                    previousMonthTotalExpense: 0,
                    categoryWiseMonthlyExpense: [],
                    allTransactions: [],
                    monthlyIncomeTrends: [],
                    monthlyExpenseTrends: [],
                    allIncomeTransactions: [],
                    allExpenseTransactions: [],
                    inflowTable: { data: [], total: 0, currentPage: 1, totalPages: 1 },
                    OutflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1},
                    inflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    },
                    isLoadingInflowTable: false,
                    
                    OutflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    },
                    isLoadingOutflowTable: false,

                    commonflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        transactionType: '',
                        searchText: '',
                    },
                    isLoadingCommonflowTable: false,
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
            
                    const newSocket = getUserSocket(accessToken, 'transactions');
            
                    // Clean up previous socket completely
                    if (transactionSocket) {
                        transactionSocket.removeAllListeners();
                        transactionSocket.disconnect();
                    }
            
                    transactionSocket = newSocket;

                    const globalDataRequest = function() {
                        newSocket.emit('request_all_transactions');
                        newSocket.emit('request_all_income_transactions');
                        newSocket.emit('request_all_expense_transactions');
                        newSocket.emit('request_monthly_income_trends');
                        newSocket.emit('request_monthly_expense_trends');
                        newSocket.emit('request_categorywise_monthly_expense');
                        newSocket.emit('request_current_month_total_expense');
                        newSocket.emit('request_current_month_total_income');
                    };
            
                    // Setup all event listeners
                    const setupSocketListeners = () => {
                        // Connection handler
                        newSocket.on('connect', () => {
                            console.log(`Connected to Transactions Server`);
                            set({ isConnected: true, connectionError: null });
                                        
                            // Request initial data after connection
                            globalDataRequest();
                        });

                        // Notify new transaction created
                        newSocket.on('transaction_created', () => {
                            globalDataRequest();
                        });

                        // Get all Transactions
                        newSocket.on('all_transactions', (allTransactions: ITransaction[]) => {
                            set({ allTransactions });
                        });

                        // Get all Income Transactions
                        newSocket.on('all_income_transactions', (allIncomeTransactions: { category: string, total: number }[]) => {
                            set({ allIncomeTransactions });
                        });

                        // Get all Expense Transactions
                        newSocket.on('all_expense_transactions', (allExpenseTransactions: { category: string, total: number }[]) => {
                            set({ allExpenseTransactions });
                        });

                        // Get all Monthly Income trends
                        newSocket.on('monthly_income_trends', (monthlyIncomeTrends: { month: string, amount: number }[]) => {
                            set({ monthlyIncomeTrends });
                        });

                        // Get all Monthly Expense trends
                        newSocket.on('monthly_expense_trends', (monthlyExpenseTrends: { month: string, amount: number }[]) => {
                            set({ monthlyExpenseTrends });
                        });

                        // Get Categorywise Monthly Expense
                        newSocket.on('categorywise_monthly_expense', (categoryWiseMonthlyExpense: { category: string, value: number }[]) => {
                            set({ categoryWiseMonthlyExpense });
                        });

                        // Get Current Month Total Expense
                        newSocket.on('current_month_total_expense', (currentMonthTotalExpense: {currentMonthExpenseTotal: number, previousMonthExpenseTotal: number}) => {
                            set({ 
                                currentMonthTotalExpense: currentMonthTotalExpense.currentMonthExpenseTotal, 
                                previousMonthTotalExpense: currentMonthTotalExpense.previousMonthExpenseTotal,
                            });
                        });

                        // Get Current Month Total Income
                        newSocket.on('current_month_total_income', (currentMonthTotalIncome: {currentMonthTotal: number, previousMonthTotal: number} ) => {
                            set({ 
                                currentMonthTotalIncome: currentMonthTotalIncome.currentMonthTotal,
                                previousMonthTotalIncome: currentMonthTotalIncome.previousMonthTotal,
                            });
                        });
                        
                        // Handle server errors gracefully - don't disconnect socket
                        newSocket.on('error', (error: Error & { type?: string }) => {
                            console.log('Server error received:', error);
                            set({ connectionError: error.message || 'Server error occurred' });
                                        
                            // Don't disconnect socket, just fall back to HTTP for data
                            // Socket connection remains intact for future updates
                            if (error.type === 'transaction_error') {
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
                            console.error('Transaction socket connect error:', error);
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
                    console.error("Failed to initialize transaction socket:", error);
                    set({ connectionError: "Unable to fetch token. Please login again." });
                    // Still try to get data via HTTP
                    get().fetchAllDataWithHttpFallback();
                }
            },
                        
            disconnectSocket: () => {
                if (transactionSocket) {
                    transactionSocket.removeAllListeners();
                    transactionSocket.disconnect();
                    transactionSocket = null;
                }

                set({
                    currentMonthTotalIncome: 0,
                    previousMonthTotalIncome: 0,
                    currentMonthTotalExpense: 0,
                    previousMonthTotalExpense: 0,
                    categoryWiseMonthlyExpense: [],
                    allTransactions: [],
                    monthlyIncomeTrends: [],
                    monthlyExpenseTrends: [],
                    allIncomeTransactions: [],
                    allExpenseTransactions: [],
                    inflowTable: { data: [], total: 0, currentPage: 1, totalPages: 1 },
                    OutflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1},
                    inflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    },
                    isLoadingInflowTable: false,
                    
                    OutflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    },
                    isLoadingOutflowTable: false,

                    commonflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        transactionType: '',
                        searchText: '',
                    },
                    isLoadingCommonflowTable: false,
                    isConnected: false,
                    connectionError: null,
                });

                get().fetchAllDataWithHttpFallback();
            },
                        
            fetchAllDataWithHttpFallback: async () => {
                try {
                    await Promise.all([
                        get().fetchAllExpenseTransactions(),
                        get().fetchAllIncomeTransactions(),
                        get().fetchAllTransactions(),
                        get().fetchCategoryWiseExpenses(),
                        get().fetchMonthlyExpenseTrends(),
                        get().fetchMonthlyIncomeTrends(),
                        get().fetchMonthlyTotalExpense(),
                        get().fetchMonthlyTotalIncome(),
                    ]);
                    
                    // Clear connection error if HTTP fallback succeeds
                    set({ connectionError: null });
                } catch (error) {
                    console.error("HTTP fallback failed:", error);
                }
            },

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
                    set({ currentMonthTotalExpense: data.totalMonthlyExpense.currentMonthExpenseTotal });
                    set({ previousMonthTotalExpense: data.totalMonthlyExpense.previousMonthExpenseTotal });
                } catch (error) {
                    console.error(`Failed to get total Monthly Expense`, error);
                    set({ currentMonthTotalExpense: 0 });
                    set({ previousMonthTotalExpense: 0 });
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
                    set({ monthlyIncomeTrends: data.transactions });
                } catch (error) {
                    console.error(`Failed to get Monthly Trends`, error);
                    set({ monthlyIncomeTrends: [] });
                }
            },

            // fetch Monthly Expense Trends 
            fetchMonthlyExpenseTrends: async () => {
                try {
                    const response = await getMonthlyExpenseTrends();
                    const data = await response.data;
                    set({ monthlyExpenseTrends: data.transactions });
                } catch (error) {
                    console.error(`Failed to get Monthly Trends`, error);
                    set({ monthlyExpenseTrends: [] });
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

            // fetch All Expense Transactions 
            fetchAllExpenseTransactions: async () => {
                try {
                    const response = await getAllExpenseTransactions();
                    const data = await response.data;
                    set({ allExpenseTransactions: data.transactions });
                } catch (error) {
                    console.error(`Failed to get total transaction`, error);
                    set({ allExpenseTransactions: [] });
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

            // Updated fetch All Outflow Table with filters
            fetchTableOutflow: async () => {
                try {
                    set({ isLoadingOutflowTable: true });
                    await new Promise(resolve => setTimeout(resolve, 250));
                    const { OutflowFilters } = get();
                    
                    const response = await fetchOutflowTable(
                        OutflowFilters.page,
                        OutflowFilters.limit,
                        OutflowFilters.timeRange,
                        OutflowFilters.category || undefined,
                        OutflowFilters.searchText || undefined
                    );
                    
                    const data = response.data;
                    set({ OutflowTable: data.transactions });
                } catch (error) {
                    console.error(`Failed to get Outflow table`, error);
                    set({ OutflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1} });
                } finally {
                    set({ isLoadingOutflowTable: false });
                }
            },

            // New filter actions
            setOutflowPage: (page: number) => {
                set(state => ({
                    OutflowFilters: { ...state.OutflowFilters, page }
                }));
                // Auto-fetch when page changes
                setTimeout(() => get().fetchTableOutflow(), 0);
            },

            setOutflowLimit: (limit: number) => {
                set(state => ({
                    OutflowFilters: { ...state.OutflowFilters, limit, page: 1 } // Reset to page 1 when limit changes
                }));
                // Auto-fetch when limit changes
                setTimeout(() => get().fetchTableOutflow(), 0);
            },

            setOutflowTimeRange: (timeRange: string) => {
                set(state => ({
                    OutflowFilters: { ...state.OutflowFilters, timeRange, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when timeRange changes
                setTimeout(() => get().fetchTableOutflow(), 0);
            },

            setOutflowCategory: (category: string) => {
                set(state => ({
                    OutflowFilters: { ...state.OutflowFilters, category, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when category changes
                setTimeout(() => get().fetchTableOutflow(), 0);
            },

            setOutflowSearchText: (searchText: string) => {
                set(state => ({
                    OutflowFilters: { ...state.OutflowFilters, searchText, page: 1 } // Reset to page 1 when search changes
                }));
                // Auto-fetch when search changes (you might want to debounce this)
                setTimeout(() => get().fetchTableOutflow(), 0);
            },

            clearOutflowFilters: () => {
                set({
                    OutflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        searchText: '',
                    }
                });
                // Auto-fetch when filters are cleared
                setTimeout(() => get().fetchTableOutflow(), 0);
            },

            goToNextOutflowPage: () => {
                const { OutflowTable, OutflowFilters } = get();
                if (OutflowFilters.page < OutflowTable.totalPages) {
                    get().setOutflowPage(OutflowFilters.page + 1);
                }
            },

            goToPrevOutflowPage: () => {
                const { OutflowFilters } = get();
                if (OutflowFilters.page > 1) {
                    get().setOutflowPage(OutflowFilters.page - 1);
                }
            },

            // Updated fetch All Outflow Table with filters
            fetchTableCommonflow: async () => {
                try {
                    set({ isLoadingCommonflowTable: true });
                    await new Promise(resolve => setTimeout(resolve, 250));
                    const { commonflowFilters } = get();
                    
                    const response = await fetchCommonflowTable(
                        commonflowFilters.page,
                        commonflowFilters.limit,
                        commonflowFilters.timeRange,
                        commonflowFilters.category || undefined,
                        commonflowFilters.transactionType || undefined,
                        commonflowFilters.searchText || undefined
                    );
                    
                    const data = response.data;
                    set({ commonflowTable: data.transactions });
                } catch (error) {
                    console.error(`Failed to get Commonflow table`, error);
                    set({ commonflowTable: {data: [], total: 0, currentPage: 1, totalPages: 1} });
                } finally {
                    set({ isLoadingCommonflowTable: false });
                }
            },

            // New filter actions
            setCommonflowPage: (page: number) => {
                set(state => ({
                    commonflowFilters: { ...state.commonflowFilters, page }
                }));
                // Auto-fetch when page changes
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            setCommonflowLimit: (limit: number) => {
                set(state => ({
                    commonflowFilters: { ...state.commonflowFilters, limit, page: 1 } // Reset to page 1 when limit changes
                }));
                // Auto-fetch when limit changes
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            setCommonflowTimeRange: (timeRange: string) => {
                set(state => ({
                    commonflowFilters: { ...state.commonflowFilters, timeRange, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when timeRange changes
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            setCommonflowCategory: (category: string) => {
                set(state => ({
                    commonflowFilters: { ...state.commonflowFilters, category, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when category changes
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            setCommonflowTransactionType: (transactionType: string) => {
                set(state => ({
                    commonflowFilters: { ...state.commonflowFilters, transactionType, page: 1 } // Reset to page 1 when filter changes
                }));
                // Auto-fetch when category changes
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            setCommonflowSearchText: (searchText: string) => {
                set(state => ({
                    commonflowFilters: { ...state.commonflowFilters, searchText, page: 1 } // Reset to page 1 when search changes
                }));
                // Auto-fetch when search changes
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            clearCommonflowFilters: () => {
                set({
                    commonflowFilters: {
                        page: 1,
                        limit: 10,
                        timeRange: 'year',
                        category: '',
                        transactionType: '',
                        searchText: '',
                    }
                });
                // Auto-fetch when filters are cleared
                setTimeout(() => get().fetchTableCommonflow(), 0);
            },

            goToNextCommonflowPage: () => {
                const { commonflowTable, commonflowFilters } = get();
                if (commonflowFilters.page < commonflowTable.totalPages) {
                    get().setCommonflowPage(commonflowFilters.page + 1);
                }
            },

            goToPrevCommonflowPage: () => {
                const { commonflowFilters } = get();
                if (commonflowFilters.page > 1) {
                    get().setCommonflowPage(commonflowFilters.page - 1);
                }
            },
        }),
        {
            name: 'transactions-storage', // Persisted state key
        }
    )
);

export default useTransactionStore;
