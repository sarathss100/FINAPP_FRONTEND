import { getUserSocket } from "@/lib/userSocket";
import { getAllInsurances, getInsuranceWithClosestNextPaymentDate, totalAnnualInsurancePremiumApi, totalInsuranceCoverageApi } from "@/service/insuranceService";
import { getToken } from "@/service/userService";
import { Insurance } from "@/types/IInsurance";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InsuranceState {
    allInsurances: Insurance[]; // All Insurances 
    totalInsuranceCoverage: number; // Total active insurance coverage 
    totalAnnualInsurancePremium: number; // Total annual insurance premium 
    insuranceWithClosestNextPaymentDate: Insurance; // Insurance with closest next payment date 

    isConnected: boolean;
    connectionError: string | null;

    setIsConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    initializeSocket: () => void;
    disconnectSocket: () => void;

    fetchAllDataWithHttpFallback: () => Promise<void>;
    fetchTotalInsuranceCoverage: () => Promise<void>; // Function to fetch Total Insurance Coverage 
    fetchTotalAnnualInsurancePremium: () => Promise<void>; // Function to fetch Total Annual Insurance Premium 
    fetchAllInsurances: () => Promise<void>; // Function to fetch All Insurances
    fetchInsuranceWithClosestNextPaymentDate: () => Promise<void>; // Function to fetch insurance with closest next payment date 
    reset: () => void;
}

let insuranceSocket: typeof Socket | null = null;

export const useInsuranceStore = create<InsuranceState>()(
    persist(
        (set, get) => ({
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
            isConnected: false,
            connectionError: null,

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
            
                    const newSocket = getUserSocket(accessToken, 'insurances');
            
                    // Clean up previous socket completely
                    if (insuranceSocket) {
                        insuranceSocket.removeAllListeners();
                        insuranceSocket.disconnect();
                    }
            
                    insuranceSocket = newSocket;

                    const globalDataRequest = function() {
                        newSocket.emit('request_all_insurances');
                        newSocket.emit('request_total_insurance_coverage');
                        newSocket.emit('request_total_annual_insurance_premium');
                        newSocket.emit('request_next_payment_date');
                    };
            
                    // Setup all event listeners
                    const setupSocketListeners = () => {
                        // Connection handler
                        newSocket.on('connect', () => {
                            console.log(`Connected to Insurances Server`);
                            set({ isConnected: true, connectionError: null });
                                        
                            // Request initial data after connection
                            globalDataRequest();
                        });

                        // Notify Insurance Created
                        newSocket.on('insurance_created', () => {
                            globalDataRequest();
                        });

                        // Notify Insurance Removed
                        newSocket.on('insurance_removed', () => {
                            globalDataRequest();
                        });

                        // Notify Insurance Paid
                        newSocket.on('insurance_paid', () => {
                            globalDataRequest();
                        });

                        // Get all Insurances
                        newSocket.on('all_insurances', (insurances: Insurance[]) => {
                            set({ allInsurances: insurances });
                        });

                        // Get Total Insurance Coverage
                        newSocket.on('total_insurance_coverage', (totalInsuranceCoverage: number) => {
                            set({ totalInsuranceCoverage });
                        });

                        // Get Total Insurance Annual Premium
                        newSocket.on('total_annual_insurance_premium', (totalAnnualInsurancePremium: number) => {
                            set({ totalAnnualInsurancePremium });
                        });

                        // Get Next Payment Date
                        newSocket.on('next_payment_date', (insuranceWithClosestNextPaymentDate: Insurance) => {
                            set({ insuranceWithClosestNextPaymentDate });
                        });
            
                        // Handle server errors gracefully - don't disconnect socket
                        newSocket.on('error', (error: Error & { type?: string }) => {
                            console.log('Server error received:', error);
                            set({ connectionError: error.message || 'Server error occurred' });
                                        
                            // Don't disconnect socket, just fall back to HTTP for data
                            // Socket connection remains intact for future updates
                            if (error.type === 'insurance_error') {
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
                            console.error('Insurance socket connect error:', error);
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
                if (insuranceSocket) {
                    insuranceSocket.removeAllListeners();
                    insuranceSocket.disconnect();
                    insuranceSocket = null;
                }

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
                    isConnected: false,
                    connectionError: null,
                });

                get().fetchAllDataWithHttpFallback();
            },
            
            fetchAllDataWithHttpFallback: async () => {
                try {
                    await Promise.all([
                        get().fetchAllInsurances(),
                        get().fetchInsuranceWithClosestNextPaymentDate(),
                        get().fetchTotalAnnualInsurancePremium(),
                        get().fetchTotalInsuranceCoverage(),
                    ]);
                    
                    // Clear connection error if HTTP fallback succeeds
                    set({ connectionError: null });
                } catch (error) {
                    console.error("HTTP fallback failed:", error);
                }
            },
            
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