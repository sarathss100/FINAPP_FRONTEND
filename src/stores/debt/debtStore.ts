import { getUserSocket } from '@/lib/userSocket';
import { getAllDebts, getBadDebts, getGoodDebts, getLongestTenure, getRepaymentSimulationResult, getTotalDebtExist, getTotalMonthlyPayment, getTotalOutstandingAmount } from '@/service/debtService';
import { getToken } from '@/service/userService';
import { ComparisonResult, IDebt } from '@/types/IDebt';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IDebtState {
    allDebts: IDebt[];  
    totalDebt: number; 
    totalOutstandingDebtAmount: number; 
    totalMonthlyPayment: number; 
    longestDebtTenure: number;
    goodDebts: IDebt[];  
    badDebts: IDebt[]; 
    repaymentSimulationResult: ComparisonResult;

    isConnected: boolean;
    connectionError: string | null;

    setIsConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    initializeSocket: () => void;
    disconnectSocket: () => void;

    fetchAllDataWithHttpFallback: () => Promise<void>;
    fetchAllDebts: () => Promise<void>; 
    fetchTotalDebt: () => Promise<void>; 
    fetchTotalOutstandingDebtAmount: () => void; 
    fetchTotalMonthlyPayment: () => void; 
    fetchLongestDebtTenure: () => Promise<void>;  
    fetchGoodDebts: () => Promise<void>;
    fetchBadDebts: () => Promise<void>;
    fetchRepaymentSimulationResult: () => Promise<void>;
    reset: () => void;
}

let debtsSocket: typeof Socket | null = null;

const useDebtStore = create<IDebtState>()(
    persist(
        (set, get) => ({
            allDebts: [],
            totalDebt: 0,
            totalOutstandingDebtAmount: 0,
            totalMonthlyPayment: 0,
            longestDebtTenure: 0,
            goodDebts: [],
            badDebts: [],
            repaymentSimulationResult: { 
                snowball: {
                    totalMonths: 0,
                    totalInterestPaid: 0,
                    totalMonthlyPayment: 0,
                },
                avalanche: {
                    totalMonths: 0,
                    totalInterestPaid: 0,
                    totalMonthlyPayment: 0,
                }
            },
            isConnected: false,
            connectionError: null,

            // Reset function
            reset: () => 
                set({
                    allDebts: [],
                    totalDebt: 0,
                    totalOutstandingDebtAmount: 0,
                    totalMonthlyPayment: 0,
                    longestDebtTenure: 0,
                    goodDebts: [],
                    badDebts: [],
                    repaymentSimulationResult: { 
                        snowball: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        },
                        avalanche: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        }
                    },
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
            
                    const newSocket = getUserSocket(accessToken, 'debts');
            
                    // Clean up previous socket completely
                    if (debtsSocket) {
                        debtsSocket.removeAllListeners();
                        debtsSocket.disconnect();
                    }
            
                    debtsSocket = newSocket;

                    const globalDataRequest = function() {
                        newSocket.emit('request_all_debts');
                        newSocket.emit('request_total_debt');
                        newSocket.emit('request_total_outstanding_debt');
                        newSocket.emit('request_total_monthly_payment');
                        newSocket.emit('request_longest_debt_duration');
                        newSocket.emit('request_good_debts');
                        newSocket.emit('request_bad_debts');
                        newSocket.emit('request_repayment_simulation_results');
                    };
            
                    // Setup all event listeners
                    const setupSocketListeners = () => {
                        // Connection handler
                        newSocket.on('connect', () => {
                            console.log(`Connected to Debts Server`);
                            set({ isConnected: true, connectionError: null });
                                        
                            // Request initial data after connection
                            globalDataRequest();
                        });

                        // Debt Creation alert
                        newSocket.on('debt_created', () => {
                            globalDataRequest();
                        });

                        // Debt Deletion alert
                        newSocket.on('debt_removed', () => {
                            globalDataRequest();
                        });

                        // Get all debts
                        newSocket.on('all_debts', (debts: IDebt[]) => {
                            set({ allDebts: debts });
                        });

                        // Get total Debt
                        newSocket.on('total_debt', (totalDebt: number) => {
                            set({ totalDebt: totalDebt });
                        });

                        // Get total Outstanding Debt
                        newSocket.on('total_outstanding_debt', (totalOutstandingDebt: number) => {
                            set({ totalOutstandingDebtAmount: totalOutstandingDebt });
                        });

                        // Get total Monthly Payment
                        newSocket.on('total_monthly_payment', (totalMonthlyPayment: number) => {
                            set({ totalMonthlyPayment });
                        });

                        // Get Longest Debt Duration
                        newSocket.on('longest_debt_duration', (longestDebtTenure: number) => {
                            set({ longestDebtTenure });
                        });

                        // Get Good Debts
                        newSocket.on('good_debts', (goodDebts: IDebt[]) => {
                            set({ goodDebts });
                        });

                        // Get Bad Debts
                        newSocket.on('bad_debts', (badDebts: IDebt[]) => {
                            set({ badDebts });
                        });

                        // Get Repayment Simulation Results
                        newSocket.on('repayment_simulation_results', (repaymentSimulationResult: ComparisonResult) => {
                            set({ repaymentSimulationResult });
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
                            console.error('Debts socket connect error:', error);
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
                    console.error("Failed to initialize debt socket:", error);
                    set({ connectionError: "Unable to fetch token. Please login again." });
                    // Still try to get data via HTTP
                    get().fetchAllDataWithHttpFallback();
                }
            },

            disconnectSocket: () => {
                if (debtsSocket) {
                    debtsSocket.removeAllListeners();
                    debtsSocket.disconnect();
                    debtsSocket = null;
                }

                set({
                    allDebts: [],
                    totalDebt: 0,
                    totalOutstandingDebtAmount: 0,
                    totalMonthlyPayment: 0,
                    longestDebtTenure: 0,
                    goodDebts: [],
                    badDebts: [],
                    repaymentSimulationResult: { 
                        snowball: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        },
                        avalanche: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        }
                    },
                    isConnected: false,
                    connectionError: null,
                });

                get().fetchAllDataWithHttpFallback();
            },

            fetchAllDataWithHttpFallback: async () => {
                try {
                    await Promise.all([
                        get().fetchAllDebts(),
                        get().fetchBadDebts(),
                        get().fetchGoodDebts(),
                        get().fetchLongestDebtTenure(),
                        get().fetchRepaymentSimulationResult(),
                        get().fetchTotalDebt(),
                        get().fetchTotalMonthlyPayment(),
                        get().fetchTotalOutstandingDebtAmount(),
                    ]);
                    
                    // Clear connection error if HTTP fallback succeeds
                    set({ connectionError: null });
                } catch (error) {
                    console.error("HTTP fallback failed:", error);
                }
            },

            // Fetches all debt records for the authenticated user
            fetchAllDebts: async () => {
                try {
                    const response = await getAllDebts();
                    const data = await response.data;
                    set({ allDebts: data.debtDetails });
                } catch (error) {
                    console.error('Failed to fetch all debt records', error);
                    set({ allDebts: [] });
                }
            },

            // Fetche Total Debt 
            fetchTotalDebt: async () => {
                try {
                    const response = await getTotalDebtExist();
                    const data = await response.data;
                    set({ totalDebt: data.totalDebt });
                } catch (error) {
                    console.error('Failed to fetch Total Debt', error);
                    set({ totalDebt: 0 });
                }
            },

            // Fetche Total Outstanding Debt Amount 
            fetchTotalOutstandingDebtAmount: async () => {
                try {
                    const response = await getTotalOutstandingAmount();
                    const data = await response.data;
                    set({ totalOutstandingDebtAmount: data.totalOutstandingDebt });
                } catch (error) {
                    console.error('Failed to fetch Total Outstanding Debt Amount', error);
                    set({ totalOutstandingDebtAmount: 0 });
                }
            },

            // Fetche Total Monthly Payment Amount 
            fetchTotalMonthlyPayment: async () => {
                try {
                    const response = await getTotalMonthlyPayment();
                    const data = await response.data;
                    set({ totalMonthlyPayment: data.totalMonthlyPayment });
                } catch (error) {
                    console.error('Failed to fetch Total Monthly Payment', error);
                    set({ totalMonthlyPayment: 0 });
                }
            },

            // Fetche Longest Debt Tenure 
            fetchLongestDebtTenure: async () => {
                try {
                    const response = await getLongestTenure();
                    const data = await response.data;
                    set({ longestDebtTenure: data.maxTenure });
                } catch (error) {
                    console.error('Failed to fetch Longest Debt Tenure', error);
                    set({ longestDebtTenure: 0 });
                }
            },

            // Fetch Good Debts  
            fetchGoodDebts: async () => {
                try {
                    const response = await getGoodDebts();
                    const data = await response.data;
                    set({ goodDebts: data.debtDetails });
                } catch (error) {
                    console.error('Failed to fetch Good Debts', error);
                    set({ goodDebts: [] });
                }
            },

            // Fetch Bad Debts  
            fetchBadDebts: async () => {
                try {
                    const response = await getBadDebts();
                    const data = await response.data;
                    set({ badDebts: data.debtDetails });
                } catch (error) {
                    console.error('Failed to fetch Bad Debts', error);
                    set({ badDebts: [] });
                }
            },

            // Fetch Repayment Simulation Result   
            fetchRepaymentSimulationResult: async () => {
                try {
                    const response = await getRepaymentSimulationResult();
                    const data = await response.data;
                    set({ repaymentSimulationResult: data.repaymentComparisonResult });
                } catch (error) {
                    console.error('Failed to fetch Bad Debts', error);
                    set({ repaymentSimulationResult: { 
                        snowball: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        },
                        avalanche: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        }
                    } });
                }
            },

        }),
        {
            name: 'debts-storage', // Persisted state key
        }
    )
);

export default useDebtStore;
