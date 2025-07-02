import { getCategorizedInvestments, getTotalCurrentValue, getTotalInvestedAmount, getTotalReturns } from '@/service/investmentService';
import { Investments, InvestmentType } from '@/types/IInvestments';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IInvestmentState {
    totalInvestedAmount: number; // Store the total Invested amount.
    totalCurrentValue: number; // Store the current total value.
    totalReturns: number; // Store the total returns.
    investments: Record<InvestmentType, Investments[]>; // Store the invesments.
    fetchTotalInvestedAmount: () => Promise<void>; // Function to fetch Total Invested Amount
    fetchCurrentValue: () => Promise<void>; // Function to fetch Total Current Value
    fetchTotalReturns: () => Promise<void>; // Function to fetch total returns
    fetchInvestments: () => Promise<void>; // Function to fetch investments.
    reset: () => void;
}

const useInvestmentStore = create<IInvestmentState>()(
    persist(
        (set) => ({
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
                }),

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