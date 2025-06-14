import { getLongestTenure, getTotalDebtExist, getTotalMonthlyPayment, getTotalOutstandingAmount } from '@/service/debtService';
import { IDebt } from '@/types/IDebt';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IDebtState {
    allDebts: IDebt[]; // All Debts  
    totalDebt: number // Total Debt Amount 
    totalOutstandingDebtAmount: number // Total Outstanding Debt Amount 
    totalMonthlyPayment: number // Total Monthly Payment Amount 
    longestDebtTenure: number // Longest Debt Tenure 
    fetchAllDebts: () => Promise<void>; // Function to fetch All Debts
    fetchTotalDebt: () => Promise<void>; // Function to fetch Total Debt
    fetchTotalOutstandingDebtAmount: () => void; // Function to fetch Total Outstanding Debt Amount 
    fetchTotalMonthlyPayment: () => void; // Function to fetch Total Monthly Payment 
    fetchLongestDebtTenure: () => Promise<void>; // Function to fetch Longest Debt Tenure 
    reset: () => void;
}

const useDebtStore = create<IDebtState>()(
    persist(
        (set) => ({
            allDebts: [],
            totalDebt: 0,
            totalOutstandingDebtAmount: 0,
            totalMonthlyPayment: 0,
            longestDebtTenure: 0,

            // Reset function
            reset: () => 
                set({
                    allDebts: [],
                    totalDebt: 0,
                    totalOutstandingDebtAmount: 0,
                    totalMonthlyPayment: 0,
                    longestDebtTenure: 0,
                }),

            // Fetches all debt records for the authenticated user
            fetchAllDebts: async () => {
                try {
                    // const response = await getAllDebts;
                    // const data = await response.data;
                    // set({ allDebts: data.insuranceDetails });
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

        }),
        {
            name: 'debts-storage', // Persisted state key
        }
    )
);

export default useDebtStore;
