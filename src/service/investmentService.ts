import axiosInstance from './axiosInstance';
import { IInvestmentDetails, IMutualFundSearchResult, Investments, IStockDetails, ITotalInvestedAmount } from '@/types/IInvestments';

// Searches for stocks based on a keyword by sending a GET request to the backend API
export const searchStocksFromApi = async function (keyword: string): Promise<IStockDetails> {
    try {
        // Send a GET request to fetch stock details matching the keyword
        const response = await axiosInstance.get<IStockDetails>(`/api/v1/investment/stock?keyword=${keyword}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the stock details if the search was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch stock details.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Searches for mutual funds based on a keyword by sending a GET request to the backend API.
 *
 * @param {string} keyword - The search term used to find matching mutual funds.
 * @returns {Promise<IStockDetails>} - A promise resolving to an object containing the search results.
 * @throws {Error} - Throws an error if the request fails or the response indicates failure.
 */
export const searchMutualFundFromApi = async function (keyword: string): Promise<IMutualFundSearchResult> {
    try {
        // Send a GET request to fetch mutual fund details matching the keyword
        const response = await axiosInstance.get<IMutualFundSearchResult>(`/api/v1/mutualfund/search?keyword=${keyword}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return mutual fund details if the search was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch mutual fund details.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Creates a new investment by sending the provided investment data to the backend API.
 *
 * @param {IInvestments} formData - The investment data to be sent to the server for creation.
 * @returns {Promise<IInvestmentDetails>} - A promise resolving to the response data containing created investment details.
 * @throws {Error} - Throws an error if the request fails or the response indicates failure.
 */
export const createInvestment = async function (formData: Investments): Promise<IInvestmentDetails> {
    try {

        console.log(formData);
        // Send a POST request to create a new investment
        const response = await axiosInstance.post<IInvestmentDetails>(`/api/v1/investment`, formData);
    
        // Check if the response contains a success flag
        if (response.data && response.data.success) {
            return response.data; // Return investment details if creation was successful
        } else {
            // Throw an error if the backend returned a failure message
            throw new Error(response.data?.message || 'Failed to create investment.');
        }
    } catch (error) {
        // Log the error if needed, and re-throw it for upstream handling
        console.error('Error creating investment:', error);
        throw error;
    }
};

/**
 * Fetches the total invested amount across all investments for the authenticated user.
 *
 * @returns {Promise<ITotalInvestedAmount>} - A promise resolving to the response data containing total investment summary.
 * @throws {Error} - Throws an error if the request fails or the response indicates failure.
 */
export const getTotalInvestedAmount = async function (): Promise<ITotalInvestedAmount> {
    try {
        // Send a GET request to fetch total invested amount
        const response = await axiosInstance.get<ITotalInvestedAmount>(`/api/v1/investment/summary/total-invested`);

        // Check if the response contains a success flag
        if (response.data && response.data.success) {
            return response.data; // Return summary if successful
        } else {
            // Throw an error if the backend returned a failure message
            throw new Error(response.data?.message || 'Failed to fetch total invested amount.');
        }
    } catch (error) {
        // Log the error if needed, and re-throw it for upstream handling
        console.error('Error fetching total invested amount:', error);
        throw error;
    }
};


