import { IFaqs } from '@/types/IFaq';
import axiosInstance from './axiosInstance';                                

// Fetches detailed profile information for a user from the backend API
export const getFAQs = async function (): Promise<IFaqs> {
    try {
        // Send a GET request to fetch user profile details
        const response = await axiosInstance.get<IFaqs>('/api/v1/public/faq');

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the user profile details if successfull.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to fetch user profile details.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};



