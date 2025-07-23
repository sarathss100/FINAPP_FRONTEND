import axiosInstance from './axiosInstance';
import { Insurance, InsuranceCoverage, InsuranceDetails, InsurancePremium, InsuranceRemoved, InsurancesDetails, paymentStatus } from '@/types/IInsurance';

// Fetches the total insurance coverage information for the authenticated user.
export const totalInsuranceCoverageApi = async function (): Promise<InsuranceCoverage> {
    try {
        // Send a GET request to fetch total insurance coverage data
        const response = await axiosInstance.get<InsuranceCoverage>(`insurance/coverage/total`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the coverage data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch total insurance coverage.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Fetches the total annual insurance premium for the authenticated user.
export const totalAnnualInsurancePremiumApi = async function (): Promise<InsurancePremium> {
    try {
        // Send a GET request to fetch total annual insurance premium
        const response = await axiosInstance.get<InsurancePremium>(`insurance/premium/total`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the premium data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch total annual insurance premium.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
}

// Fetches all insurance records for the authenticated user.
export const getAllInsurances = async function (): Promise<InsurancesDetails> {
    try {
        // Send a GET request to fetch all insurance records
        const response = await axiosInstance.get<InsurancesDetails>(`insurance`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the insurance records if the request was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch insurance records.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
}

// Removes an insurance record with the specified ID.
export const removeInsurance = async function (id: string): Promise<InsuranceRemoved> {
    try {
        // Send a DELETE request to remove the insurance record by ID
        const response = await axiosInstance.delete<InsuranceRemoved>(`insurance/${id}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the result if the deletion was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to remove insurance.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
}

// Creates a new insurance record using the provided form data.
export const createInsurance = async function (formData: Partial<Insurance>): Promise<InsuranceDetails> {
    try {
        // Send a POST request to create a new insurance record
        const response = await axiosInstance.post<InsuranceDetails>(`insurance`, { formData });
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the created insurance details
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to create insurance.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
}

// Retrieves the insurance policy with the closest upcoming next payment date.
export const getInsuranceWithClosestNextPaymentDate = async function (): Promise<InsuranceDetails> {
    try {
        // Send a GET request to fetch the insurance with the closest next payment date
        const response = await axiosInstance.get<InsuranceDetails>(`insurance/next-payment-date`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the retrieved insurance details
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch insurance with closest next payment date.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
}

// Updates the payment status of the specified insurance policy to "paid".
export const markPaymentAsPaid = async function (id: string): Promise<paymentStatus> {
    try {
        // Send a PATCH request to update the payment status of the insurance record
        const response = await axiosInstance.patch<paymentStatus>(`insurance/${id}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the result of the update
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to update payment status.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
}
