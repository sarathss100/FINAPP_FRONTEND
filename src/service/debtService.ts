import { IDebt, IDebtDetails, ILongestTenureDetails, ITotalDebtDetails, ITotalMonthlyPaymentDetails, ITotalOutstandingAmountDetails } from '@/types/IDebt';
import axiosInstance from './axiosInstance';

/**
 * Creates a new debt entry for the authenticated user.
 * Sends a POST request to the backend API endpoint with the provided debt data.
 *
 * @param {IDebt} formData - The debt data to be sent to the server.
 * @returns {Promise<IDebtDetails>} A promise resolving to the created debt details.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const createDebt = async function (formData: IDebt): Promise<IDebtDetails> {
    try {
        // Send a POST request to create debt 
        const response = await axiosInstance.post<IDebtDetails>(`/api/v1/debt`, { ...formData });
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to create debt.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Fetches the total outstanding debt amount for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve the total debt value.
 *
 * @returns {Promise<ITotalDebtDetails>} A promise resolving to an object containing the total outstanding debt amount.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getTotalDebtExist = async function (): Promise<ITotalDebtDetails> {
    try {
        // Send a GET request to fetch total debt data
        const response = await axiosInstance.get<ITotalDebtDetails>(`/api/v1/debt/total`);
        console.log(response);
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the debt summary data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch total debt.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Fetches the total outstanding amount across all debts for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve debt summary data.
 *
 * @returns {Promise<ITotalOutstandingAmountDetails>} A promise resolving to the debt summary including total outstanding amount.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getTotalOutstandingAmount = async function (): Promise<ITotalOutstandingAmountDetails> {
    try {
        // Send a GET request to fetch debt summary
        const response = await axiosInstance.get<ITotalOutstandingAmountDetails>(`/api/v1/debt/summary`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the summary data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch debt summary.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Fetches the total monthly payment across all debts for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve debt monthly payment data.
 *
 * @returns {Promise<ITotalMonthlyPaymentDetails>} A promise resolving to the monthly payment details,
 *                                              including the total amount due each month.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getTotalMonthlyPayment = async function (): Promise<ITotalMonthlyPaymentDetails> {
    try {
        // Send a GET request to fetch monthly payment data
        const response = await axiosInstance.get<ITotalMonthlyPaymentDetails>(`/api/v1/debt/monthly-payment`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the monthly payment data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch monthly payment data.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Fetches the longest remaining tenure among all active debts for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve the maximum debt tenure in months.
 *
 * @returns {Promise<ILongestTenureDetails>} A promise resolving to an object containing
 *                                          the longest tenure (in months) among active debts.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getLongestTenure = async function (): Promise<ILongestTenureDetails> {
    try {
        // Send a GET request to fetch the longest debt tenure
        const response = await axiosInstance.get<ILongestTenureDetails>(`/api/v1/debt/tenure`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the tenure data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch longest tenure data.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};
