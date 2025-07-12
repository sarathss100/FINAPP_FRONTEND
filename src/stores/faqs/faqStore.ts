import { getAllFaqsForAdmin } from '@/service/adminService';
import { IFaq } from '@/types/IFaq';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IPaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface IPersistedState {
    searchTerm: string;
    currentPage: number;
    itemsPerPage: number;
}

interface IFaqState {
    allFaqs: IFaq[]; // All Faqs    
    paginationMeta: IPaginationMeta;
    isLoading: boolean;
    persistedState: IPersistedState;
    fetchAllFaqs: (page?: number, limit?: number, search?: string) => Promise<void>; // Function to fetch All Faqs with pagination
    updatePersistedState: (newState: Partial<IPersistedState>) => void;
    reset: () => void;
}

const defaultPersistedState: IPersistedState = {
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 10,
};

const defaultPaginationMeta: IPaginationMeta = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
};

const useFaqStore = create<IFaqState>()(
    persist(
        (set, get) => ({
            allFaqs: [],
            paginationMeta: defaultPaginationMeta,
            isLoading: false,
            persistedState: defaultPersistedState,

            // Update persisted state
            updatePersistedState: (newState: Partial<IPersistedState>) => {
                const currentState = get().persistedState;
                set({ 
                    persistedState: { 
                        ...currentState, 
                        ...newState 
                    } 
                });
            },

            // Reset function
            reset: () => 
                set({
                    allFaqs: [],
                    paginationMeta: defaultPaginationMeta,
                    isLoading: false,
                    persistedState: defaultPersistedState,
                }),

            // Fetches all faqs records for the authenticated user with pagination
            fetchAllFaqs: async (page = 1, limit = 10, search = '') => {
                try {
                    set({ isLoading: true });
                    
                    const params = {
                        page,
                        limit,
                        ...(search && { search }),
                    };
                    
                    const response = await getAllFaqsForAdmin(params);
                    const data = await response.data;
                    
                    set({ 
                        allFaqs: data.faqDetails || [],
                        paginationMeta: {
                            currentPage: data.pagination?.currentPage || 1,
                            totalPages: data.pagination?.totalPages || 1,
                            totalItems: data.pagination?.totalItems || 0,
                            itemsPerPage: data.pagination?.itemsPerPage || limit,
                            hasNextPage: data.pagination?.hasNextPage || false,
                            hasPreviousPage: data.pagination?.hasPreviousPage || false,
                        },
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('Failed to fetch all faq records', error);
                    set({ 
                        allFaqs: [],
                        paginationMeta: {
                            currentPage: 1,
                            totalPages: 1,
                            totalItems: 0,
                            itemsPerPage: limit,
                            hasNextPage: false,
                            hasPreviousPage: false,
                        },
                        isLoading: false,
                    });
                }
            },

        }),
        {
            name: 'faqs-storage',
            partialize: (state) => ({ 
                persistedState: state.persistedState 
            }),
        }
    )
);

export default useFaqStore;