import axiosInstance from './axiosInstance';
import { ICheckout, InitiatePayment } from '@/types/ISubscription';

/**
 * Initiates a payment process by sending checkout details to the backend.
 * This function makes a POST request to the subscription checkout endpoint.
 */
export const initiatePayment = async function(formData: ICheckout): Promise<InitiatePayment> {
    try {
        const response = await axiosInstance.post<InitiatePayment>(`/api/v1/subscription/checkout`, formData);
    
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to initiate payment.');
        }
    } catch (error) {
        throw error;
    }
};