import { getUserSocket } from "@/lib/userSocket";
import {
    getTotalBalance,
    getTotalBankBalance,
    getTotalDebt,
    getTotalInvestment,
    getUserAccounts
} from "@/service/accountService";
import { getToken } from "@/service/userService";
import { IAccount } from "@/types/IAccounts";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Only store serializable data in Zustand state
interface BalanceUpdate {
    totalBalance?: number;
    totalBankBalance?: number;
    totalDebt?: number;
    totalInvestment?: number;
}

interface AccountState {
    totalBalance: number;
    totalBankBalance: number;
    totalDebt: number;
    totalInvestment: number;
    bankAccounts: IAccount[];
    investmentAccounts: IAccount[];
    debtAccounts: IAccount[];
    liquidAccounts: IAccount[];
    isConnected: boolean;
    connectionError: string | null;

    // Actions
    setIsConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    initializeSocket: () => void;
    disconnectSocket: () => void;

    fetchAllDataWithHttpFallback: () => Promise<void>;
    fetchTotalBalance: () => Promise<void>;
    fetchTotalBankBalance: () => Promise<void>;
    fetchTotalDebt: () => Promise<void>;
    fetchTotalInvestment: () => Promise<void>;
    fetchAllAccounts: () => Promise<void>;
    updateBalances: (data: BalanceUpdate) => void;
    updateAccounts: (data: IAccount[]) => void;
    reset: () => void;
}

// Store outside Zustand state
let accountSocket: typeof Socket | null = null;

export const useAccountsStore = create<AccountState>()(
    persist(
        (set, get) => ({
            totalBalance: 0,
            totalBankBalance: 0,
            totalDebt: 0,
            totalInvestment: 0,
            bankAccounts: [],
            investmentAccounts: [],
            debtAccounts: [],
            liquidAccounts: [],
            isConnected: false,
            connectionError: null,

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

                    const newSocket = getUserSocket(accessToken, 'accounts');

                    // Clean up previous socket completely
                    if (accountSocket) {
                        accountSocket.removeAllListeners();
                        accountSocket.disconnect();
                    }

                    accountSocket = newSocket;

                    // Setup all event listeners - remove hasListeners check
                    const setupSocketListeners = () => {
                        // Connection handler
                        newSocket.on('connect', () => {
                            console.log(`Connected to Accounts Server`);
                            set({ isConnected: true, connectionError: null });
                            
                            // Request initial data after connection
                            newSocket.emit('request_balance_update');
                            newSocket.emit('request_accounts_update');
                        });

                        // Balance Update
                        newSocket.on('balance_update', (data: BalanceUpdate) => {
                            set({
                                totalBalance: data.totalBalance || 0,
                                totalBankBalance: data.totalBankBalance || 0,
                                totalDebt: data.totalDebt || 0,
                                totalInvestment: data.totalInvestment || 0,
                            });
                        });

                        // Accounts Update
                        newSocket.on('accounts_update', (data: Record<string, IAccount>) => {
                            const accountsArray = Object.values(data);

                            const bankAccounts = accountsArray.filter(acc => acc.account_type === 'Bank');
                            const investmentAccounts = accountsArray.filter(acc => acc.account_type === 'Investment');
                            const debtAccounts = accountsArray.filter(acc => acc.account_type === 'Debt');
                            const liquidAccounts = accountsArray.filter(acc => acc.account_type === 'Cash');

                            set({ 
                                bankAccounts, 
                                investmentAccounts, 
                                debtAccounts, 
                                liquidAccounts 
                            });
                        });

                        // New Account Created
                        newSocket.on('new_account_created', () => {
                            // Refresh accounts data
                            newSocket.emit('request_accounts_update');
                            newSocket.emit('request_balance_update');
                        });

                        newSocket.on('account_deleted', () => {
                            // Refresh accounts data
                            newSocket.emit('request_accounts_update');
                            newSocket.emit('request_balance_update');
                        });

                        newSocket.on('account_updated', () => {
                            // Refresh accounts data
                            newSocket.emit('request_accounts_update');
                            newSocket.emit('request_balance_update');
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
                            console.error('Account socket connect error:', error);
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
                        newSocket.emit('request_balance_update');
                        newSocket.emit('request_accounts_update');
                    }

                } catch (error) {
                    console.error("Failed to initialize account socket:", error);
                    set({ connectionError: "Unable to fetch token. Please login again." });
                    // Still try to get data via HTTP
                    get().fetchAllDataWithHttpFallback();
                }
            },

            disconnectSocket: () => {
                if (accountSocket) {
                    accountSocket.removeAllListeners();
                    accountSocket.disconnect();
                    accountSocket = null;
                }

                set({
                    isConnected: false,
                    bankAccounts: [],
                    investmentAccounts: [],
                    debtAccounts: [],
                    liquidAccounts: [],
                    connectionError: null,
                });

                get().fetchAllDataWithHttpFallback();
            },

            fetchAllDataWithHttpFallback: async () => {
                try {
                    await Promise.all([
                        get().fetchTotalBalance(),
                        get().fetchTotalBankBalance(),
                        get().fetchTotalDebt(),
                        get().fetchTotalInvestment(),
                        get().fetchAllAccounts(),
                    ]);
                    
                    // Clear connection error if HTTP fallback succeeds
                    set({ connectionError: null });
                } catch (error) {
                    console.error("HTTP fallback failed:", error);
                    // For fresh users, this is expected - just log it
                    // Don't set connection error as this is likely a fresh user scenario
                }
            },

            fetchTotalBalance: async () => {
                try {
                    const response = await getTotalBalance();
                    set({ totalBalance: response.data.totalBalance || 0 });
                } catch (error) {
                    console.error("Failed to fetch total balance", error);
                    set({ totalBalance: 0 });
                }
            },

            fetchTotalBankBalance: async () => {
                try {
                    const response = await getTotalBankBalance();
                    set({ totalBankBalance: response.data.totalBankBalance || 0 });
                } catch (error) {
                    console.error("Failed to fetch total bank balance", error);
                    set({ totalBankBalance: 0 });
                }
            },

            fetchTotalDebt: async () => {
                try {
                    const response = await getTotalDebt();
                    set({ totalDebt: response.data.totalDebt || 0 });
                } catch (error) {
                    console.error("Failed to fetch total debt", error);
                    set({ totalDebt: 0 });
                }
            },

            fetchTotalInvestment: async () => {
                try {
                    const response = await getTotalInvestment();
                    set({ totalInvestment: response.data.totalInvestment || 0 });
                } catch (error) {
                    console.error("Failed to fetch total investment", error);
                    set({ totalInvestment: 0 });
                }
            },

            fetchAllAccounts: async () => {
                try {
                    const response = await getUserAccounts();
                    const data = Object.values(response.data);

                    const bankAccounts = data.filter(acc => acc.account_type === 'Bank');
                    const investmentAccounts = data.filter(acc => acc.account_type === 'Investment');
                    const debtAccounts = data.filter(acc => acc.account_type === 'Debt');
                    const liquidAccounts = data.filter(acc => acc.account_type === 'Cash');

                    set({ bankAccounts, investmentAccounts, debtAccounts, liquidAccounts });
                } catch (error) {
                    console.error("Failed to fetch all accounts", error);
                    set({
                        bankAccounts: [],
                        investmentAccounts: [],
                        debtAccounts: [],
                        liquidAccounts: [],
                    });
                }
            },

            updateBalances: (data: BalanceUpdate) =>
                set({
                    totalBalance: data.totalBalance || 0,
                    totalBankBalance: data.totalBankBalance || 0,
                    totalDebt: data.totalDebt || 0,
                    totalInvestment: data.totalInvestment || 0,
                }),

            updateAccounts: (data: IAccount[]) => {
                const bankAccounts = data.filter(acc => acc.account_type === 'Bank');
                const investmentAccounts = data.filter(acc => acc.account_type === 'Investment');
                const debtAccounts = data.filter(acc => acc.account_type === 'Debt');
                const liquidAccounts = data.filter(acc => acc.account_type === 'Cash');

                set({ bankAccounts, investmentAccounts, debtAccounts, liquidAccounts });
            },
        }),
        {
            name: 'accounts-storage',
        }
    )
);