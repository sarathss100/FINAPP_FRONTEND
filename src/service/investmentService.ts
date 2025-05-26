import axiosInstance from './axiosInstance';
import { IMutualFundSearchResult, IStockDetails } from '@/types/IInvestments';

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


