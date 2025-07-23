import axiosInstance from './axiosInstance';
import { ICategorizedInvestments, IInvestmentDetails, IMutualFundSearchResult, Investments, IRemoveInvestment, IStockDetails, ITotalCurrentValue, ITotalInvestedAmount, ITotalReturns } from '@/types/IInvestments';

// Searches for stocks based on a keyword by sending a GET request to the backend API
export const searchStocksFromApi = async function (keyword: string): Promise<IStockDetails> {
    try {
        // Send a GET request to fetch stock details matching the keyword
        const response = await axiosInstance.get<IStockDetails>(`investment/stock?keyword=${keyword}`);
    
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

// Searches for mutual funds based on a keyword by sending a GET request to the backend API.
export const searchMutualFundFromApi = async function (keyword: string): Promise<IMutualFundSearchResult> {
    try {
        // Send a GET request to fetch mutual fund details matching the keyword
        const response = await axiosInstance.get<IMutualFundSearchResult>(`mutualfund/search?keyword=${keyword}`);
    
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

// Creates a new investment by sending the provided investment data to the backend API.
export const createInvestment = async function (formData: Investments): Promise<IInvestmentDetails> {
    try {

        console.log(formData);
        // Send a POST request to create a new investment
        const response = await axiosInstance.post<IInvestmentDetails>(`investment`, formData);
    
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

// Fetches the total invested amount across all investments for the authenticated user.
export const getTotalInvestedAmount = async function (): Promise<ITotalInvestedAmount> {
    try {
        // Send a GET request to fetch total invested amount
        const response = await axiosInstance.get<ITotalInvestedAmount>(`investment/summary/total-invested`);

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

// Fetches the current total value of all investments for the authenticated user.
export const getTotalCurrentValue = async function (): Promise<ITotalCurrentValue> {
    try {
        // Send a GET request to fetch current total value of investments
        const response = await axiosInstance.get<ITotalCurrentValue>(`investment/summary/current-value`);

        // Check if the response contains a success flag
        if (response.data && response.data.success) {
            return response.data; // Return summary if successful
        } else {
            // Throw an error if the backend returned a failure message
            throw new Error(response.data?.message || 'Failed to fetch current total value.');
        }
    } catch (error) {
        // Log the error if needed, and re-throw it for upstream handling
        console.error('Error fetching current total value:', error);
        throw error;
    }
};

// Fetches the total returns (profit or loss) from all investments for the authenticated user.
export const getTotalReturns = async function (): Promise<ITotalReturns> {
    try {
        // Send a GET request to fetch total investment returns
        const response = await axiosInstance.get<ITotalReturns>(`investment/summary/total-returns`);

        // Check if the response contains a success flag
        if (response.data && response.data.success) {
            return response.data; // Return summary if successful
        } else {
            // Throw an error if the backend returned a failure message
            throw new Error(response.data?.message || 'Failed to fetch total returns.');
        }
    } catch (error) {
        // Log the error if needed, and re-throw it for upstream handling
        console.error('Error fetching total returns:', error);
        throw error;
    }
};

// Fetches all investments for the authenticated user, categorized by investment type.
export const getCategorizedInvestments = async function (): Promise<ICategorizedInvestments> {
    try {
        // Send a GET request to fetch categorized investments
        const response = await axiosInstance.get<ICategorizedInvestments>(`investment/categorized`);

        // Check if the response contains a success flag
        if (response.data && response.data.success) {
            return response.data; // Return categorized investments if successful
        } else {
            // Throw an error if the backend returned a failure message
            throw new Error(response.data?.message || 'Failed to fetch categorized investments.');
        }
    } catch (error) {
        // Log the error and re-throw it for upstream handling
        console.error('Error fetching categorized investments:', error);
        throw error;
    }
};

// Removes an investment of the specified type and ID from the server.
export const removeInvestment = async function (investmentType: string, investmentId: string): Promise<IRemoveInvestment> {
    try {
        // Send DELETE request to remove the investment
        const response = await axiosInstance.post<IRemoveInvestment>(`investment/${investmentType}/${investmentId}`);

        if (response.data && response.data.success) {
            return response.data; // Return success response
        } else {
            throw new Error(response.data?.message || 'Failed to remove investment.');
        }
    } catch (error) {
        console.error('Error removing investment:', error);
        throw error;
    }
};

