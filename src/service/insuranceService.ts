import axiosInstance from './axiosInstance';
import { Insurance, InsuranceCoverage, InsuranceDetails, InsurancePremium, InsuranceRemoved, InsurancesDetails, paymentStatus } from '@/types/IInsurance';

/**
 * Fetches the total insurance coverage information for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve aggregated coverage details.
 *
 * @returns {Promise<InsuranceCoverage>} A promise resolving to the total insurance coverage data.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const totalInsuranceCoverageApi = async function (): Promise<InsuranceCoverage> {
    try {
        // Send a GET request to fetch total insurance coverage data
        const response = await axiosInstance.get<InsuranceCoverage>(`/api/v1/insurance/coverage/total`);
    
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

/**
 * Fetches the total annual insurance premium for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve aggregated premium details.
 *
 * @returns {Promise<InsurancePremium>} A promise resolving to the total annual insurance premium data.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const totalAnnualInsurancePremiumApi = async function (): Promise<InsurancePremium> {
    try {
        // Send a GET request to fetch total annual insurance premium
        const response = await axiosInstance.get<InsurancePremium>(`/api/v1/insurance/premium/total`);
    
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

/**
 * Fetches all insurance records for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve detailed insurance information.
 *
 * @returns {Promise<InsurancesDetails>} A promise resolving to an object containing detailed insurance records.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getAllInsurances = async function (): Promise<InsurancesDetails> {
    try {
        // Send a GET request to fetch all insurance records
        const response = await axiosInstance.get<InsurancesDetails>(`/api/v1/insurance`);
    
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

/**
 * Removes an insurance record with the specified ID.
 * Sends a DELETE request to the backend API endpoint to delete the insurance record.
 *
 * @param {string} id - The ID of the insurance record to be removed.
 * @returns {Promise<InsuranceRemoved>} A promise resolving to the response indicating success or failure of the deletion.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const removeInsurance = async function (id: string): Promise<InsuranceRemoved> {
    try {
        // Send a DELETE request to remove the insurance record by ID
        const response = await axiosInstance.delete<InsuranceRemoved>(`/api/v1/insurance/${id}`);
    
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

/**
 * Creates a new insurance record using the provided form data.
 * Sends a POST request to the backend API endpoint to store the new insurance data.
 *
 * @param {Insurance} formData - The insurance data to be created.
 * @returns {Promise<InsuranceDetails>} A promise resolving to the response containing the created insurance details.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const createInsurance = async function (formData: Partial<Insurance>): Promise<InsuranceDetails> {
    try {
        // Send a POST request to create a new insurance record
        const response = await axiosInstance.post<InsuranceDetails>(`/api/v1/insurance`, { formData });
    
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

/**
 * Retrieves the insurance policy with the closest upcoming next payment date.
 * Sends a GET request to the backend API endpoint to fetch the relevant insurance data.
 *
 * @returns {Promise<InsuranceDetails>} A promise resolving to the response containing the insurance record with the nearest next payment date.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getInsuranceWithClosestNextPaymentDate = async function (): Promise<InsuranceDetails> {
    try {
        // Send a GET request to fetch the insurance with the closest next payment date
        const response = await axiosInstance.get<InsuranceDetails>(`/api/v1/insurance/next-payment-date`);
    
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

/**
 * Updates the payment status of the specified insurance policy to "paid".
 * Sends a PATCH request to the backend API endpoint to perform the update.
 *
 * @param {string} id - The ID of the insurance policy to update.
 * @returns {Promise<paymentStatus>} A promise resolving to the response indicating success or failure of the update operation.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const markPaymentAsPaid = async function (id: string): Promise<paymentStatus> {
    try {
        // Send a PATCH request to update the payment status of the insurance record
        const response = await axiosInstance.patch<paymentStatus>(`/api/v1/insurance/${id}`);
    
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
