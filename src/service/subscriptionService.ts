import axiosInstance from './axiosInstance';
import { ICheckout, InitiatePayment, SubscriptionStatus } from '@/types/ISubscription';

// Initiates a payment process by sending checkout details to the backend.
export const initiatePayment = async function(formData: ICheckout): Promise<InitiatePayment> {
    try {
        const response = await axiosInstance.post<InitiatePayment>(`subscription/checkout`, formData);
    
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to initiate payment.');
        }
    } catch (error) {
        throw error;
    }
};

export const fetchSubscriptionStatus = async function(): Promise<SubscriptionStatus> {
    try {
        const response = await axiosInstance.get<SubscriptionStatus>(`user/subscription-status`);
    
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to get subscription status.');
        }
    } catch (error) {
        throw error;
    }
};