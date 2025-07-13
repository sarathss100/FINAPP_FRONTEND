import { getTotalBalance, getTotalBankBalance, getTotalDebt, getTotalInvestment, getUserAccounts } from "@/service/accountService";
import { IAccount } from "@/types/IAccounts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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