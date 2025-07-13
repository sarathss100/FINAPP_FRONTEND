import { getAllInsurances, getInsuranceWithClosestNextPaymentDate, totalAnnualInsurancePremiumApi, totalInsuranceCoverageApi } from "@/service/insuranceService";
import { Insurance } from "@/types/IInsurance";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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