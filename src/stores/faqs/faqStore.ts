import { getAllFaqsForAdmin } from '@/service/adminService';
import { IFaq } from '@/types/IFaq';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IFaqState {
    allFaqs: IFaq[]; // All Faqs    
    fetchAllFaqs: () => Promise<void>; // Function to fetch All Faqs
    reset: () => void;
}

const useFaqStore = create<IFaqState>()(
    persist(
        (set) => ({
            allFaqs: [],

            // Reset function
            reset: () => 
                set({
                    allFaqs: [],
                }),

            // Fetches all faqs records for the authenticated user
            fetchAllFaqs: async () => {
                try {
                    const response = await getAllFaqsForAdmin();
                    const data = await response.data;
                    set({ allFaqs: data.faqDetails });
                } catch (error) {
                    console.error('Failed to fetch all faq records', error);
                    set({ allFaqs: [] });
                }
            },

        }),
        {
            name: 'faqs-storage', // Persisted state key
        }
    )
);

export default useFaqStore;
