import { getTotalInvestedAmount } from '@/service/investmentService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IInvestmentState {
    totalInvestedAmount: number; // Store the total Invested amount.
    fetchTotalInvestedAmount: () => Promise<void>; // Function to fetch Total Invested Amount
    reset: () => void;
}

const useInvestmentStore = create<IInvestmentState>()(
    persist(
        (set) => ({
            totalInvestedAmount: 0,

            // Reset function
            reset: () => 
                set({
                    totalInvestedAmount: 0,
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
        }),
        {
            name: 'investments-storage', // Persisted state key
        }
    )
);

export default useInvestmentStore;