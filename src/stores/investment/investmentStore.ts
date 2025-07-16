import { getUserSocket } from '@/lib/userSocket';
import { getCategorizedInvestments, getTotalCurrentValue, getTotalInvestedAmount, getTotalReturns } from '@/service/investmentService';
import { getToken } from '@/service/userService';
import { Investments, InvestmentType } from '@/types/IInvestments';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IInvestmentState {
    totalInvestedAmount: number; // Store the total Invested amount.
    totalCurrentValue: number; // Store the current total value.
    totalReturns: number; // Store the total returns.
    investments: Record<InvestmentType, Investments[]>; // Store the invesments.

    isConnected: boolean;
    connectionError: string | null;

    setIsConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    initializeSocket: () => void;
    disconnectSocket: () => void;

    fetchAllDataWithHttpFallback: () => Promise<void>;
    fetchTotalInvestedAmount: () => Promise<void>; // Function to fetch Total Invested Amount
    fetchCurrentValue: () => Promise<void>; // Function to fetch Total Current Value
    fetchTotalReturns: () => Promise<void>; // Function to fetch total returns
    fetchInvestments: () => Promise<void>; // Function to fetch investments.
    reset: () => void;
}

let investmentSocket: typeof Socket | null = null;

const useInvestmentStore = create<IInvestmentState>()(
    persist(
        (set, get) => ({
            totalInvestedAmount: 0,
            totalCurrentValue: 0,
            totalReturns: 0,
            investments: {
                "STOCK": [],
                "BOND": [],
                "BUSINESS": [],
                "EPFO": [],
                "FIXED_DEPOSIT": [],
                "GOLD": [],
                "MUTUAL_FUND": [],
                "PROPERTY": [],
                "PARKING_FUND": [],
            },
            isConnected: false,
            connectionError: null,

            // Reset function
            reset: () => 
                set({
                    totalInvestedAmount: 0,
                    totalCurrentValue: 0,
                    totalReturns: 0,
                    investments: {
                        "STOCK": [],
                        "BOND": [],
                        "BUSINESS": [],
                        "EPFO": [],
                        "FIXED_DEPOSIT": [],
                        "GOLD": [],
                        "MUTUAL_FUND": [],
                        "PROPERTY": [],
                        "PARKING_FUND": [],
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
            
                    const newSocket = getUserSocket(accessToken, 'investments');
            
                    // Clean up previous socket completely
                    if (investmentSocket) {
                        investmentSocket.removeAllListeners();
                        investmentSocket.disconnect();
                    }
            
                    investmentSocket = newSocket;

                    const globalDataRequest = function() {
                        newSocket.emit('request_all_investments');
                        newSocket.emit('request_total_invested_amount');
                        newSocket.emit('request_current_valuation');
                        newSocket.emit('request_total_returns');
                    };
            
                    // Setup all event listeners
                    const setupSocketListeners = () => {
                        // Connection handler
                        newSocket.on('connect', () => {
                            console.log(`Connected to Investments Server`);
                            set({ isConnected: true, connectionError: null });
                                        
                            // Request initial data after connection
                            globalDataRequest();
                        });

                        // Notify investment creation
                        newSocket.on('investment_created', () => {
                            globalDataRequest();
                        });

                        // Notify investment deletion
                        newSocket.on('investment_removed', () => {
                            globalDataRequest();
                        });

                        // Get all Investments
                        newSocket.on('all_investments', (investments: Record<InvestmentType, Investments[]>) => {
                            set({ investments });
                        });

                        // Get total Invested Amount
                        newSocket.on('total_invested_amount', (totalInvestedAmount: number) => {
                            set({ totalInvestedAmount });
                        });

                        // Get total Current Valuation
                        newSocket.on('current_valuation', (totalCurrentValue: number) => {
                            set({ totalCurrentValue });
                        });

                        // Get total returns
                        newSocket.on('total_returns', (totalReturns: number) => {
                            set({ totalReturns });
                        });
            
                        // Handle server errors gracefully - don't disconnect socket
                        newSocket.on('error', (error: Error & { type?: string }) => {
                            console.log('Server error received:', error);
                            set({ connectionError: error.message || 'Server error occurred' });
                                        
                            // Don't disconnect socket, just fall back to HTTP for data
                            // Socket connection remains intact for future updates
                            if (error.type === 'investments_error') {
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
                            console.error('Investments socket connect error:', error);
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
                    console.error("Failed to initialize investments socket:", error);
                    set({ connectionError: "Unable to fetch token. Please login again." });
                    // Still try to get data via HTTP
                    get().fetchAllDataWithHttpFallback();
                }
            },
                        
            disconnectSocket: () => {
                if (investmentSocket) {
                    investmentSocket.removeAllListeners();
                    investmentSocket.disconnect();
                    investmentSocket = null;
                }

                set({
                    totalInvestedAmount: 0,
                    totalCurrentValue: 0,
                    totalReturns: 0,
                    investments: {
                        "STOCK": [],
                        "BOND": [],
                        "BUSINESS": [],
                        "EPFO": [],
                        "FIXED_DEPOSIT": [],
                        "GOLD": [],
                        "MUTUAL_FUND": [],
                        "PROPERTY": [],
                        "PARKING_FUND": [],
                    },
                    isConnected: false,
                    connectionError: null,
                });

                get().fetchAllDataWithHttpFallback();
            },
                        
            fetchAllDataWithHttpFallback: async () => {
                try {
                    await Promise.all([
                        get().fetchCurrentValue(),
                        get().fetchInvestments(),
                        get().fetchTotalInvestedAmount(),
                        get().fetchTotalReturns(),
                    ]);
                    
                    // Clear connection error if HTTP fallback succeeds
                    set({ connectionError: null });
                } catch (error) {
                    console.error("HTTP fallback failed:", error);
                }
            },

            // Fetches total invested Amount
            fetchTotalInvestedAmount: async () => {
                try {
                    const response = await getTotalInvestedAmount();
                    const data = await response.data;
                    set({ totalInvestedAmount: data.totalInvestedAmount });
                } catch (error) {
                    console.error('Failed to fetch total invested amount', error);
                    set({ totalInvestedAmount: 0 });
                }
            },

            // Fetches total invested Amount
            fetchCurrentValue: async () => {
                try {
                    const response = await getTotalCurrentValue();
                    const data = await response.data;
                    set({ totalCurrentValue: data.currentTotalValue});
                } catch (error) {
                    console.error('Failed to fetch total invested amount', error);
                    set({ totalCurrentValue: 0 });
                }
            },

            // Fetches total returns
            fetchTotalReturns: async () => {
                try {
                    const response = await getTotalReturns();
                    const data = await response.data;
                    set({ totalReturns: data.totalReturns });
                } catch (error) {
                    console.error('Failed to fetch total returns', error);
                    set({ totalReturns: 0 });
                }
            },

            // Fetches total returns
            fetchInvestments: async () => {
                try {
                    const response = await getCategorizedInvestments();
                    const data = await response.data;
                    set({ investments: data.investments });
                } catch (error) {
                    console.error('Failed to fetch investments', error);
                    set({ 
                        investments: {
                            "STOCK": [],
                            "BOND": [],
                            "BUSINESS": [],
                            "EPFO": [],
                            "FIXED_DEPOSIT": [],
                            "GOLD": [],
                            "MUTUAL_FUND": [],
                            "PROPERTY": [],
                            "PARKING_FUND": [],
                        },
                    });
                }
            },
        }),
        {
            name: 'investments-storage', // Persisted state key
        }
    )
);

export default useInvestmentStore;