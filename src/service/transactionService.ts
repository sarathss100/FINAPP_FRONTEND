import { ITransaction, ITransactionDetails } from '@/types/ITransaction';
import axiosInstance from './axiosInstance';

// Sends a request to add a new transaction for a user via the backend API
export const addTransaction = async function (formData: ITransaction): Promise<ITransactionDetails> {
    try {
        // Send a POST request to add a transaction
        const response = await axiosInstance.post<ITransactionDetails>('/api/v1/transaction/create', formData);

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the added transaction details if successful.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to add Transaction.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};
