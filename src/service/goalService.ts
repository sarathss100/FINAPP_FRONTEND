import ISmartAnalysisResult from '@/types/ISmartAnalysis';
import axiosInstance from './axiosInstance';
import { IGoal, IGoalDetails, ILongestTimePeriod, ITotalActiveGoalAmount } from '@/types/IGoal';
import ICategoryByGoals from '@/types/ICategoryByGoals';

// Sends a request to create a new goal for a user via the backend API
export const createGoal = async function (formData: IGoal): Promise<IGoalDetails> {
    try {
        formData = {...formData, current_amount: (formData.target_amount - formData.initial_investment)}
        // Send a POST request to create a new goal
        const response = await axiosInstance.post<IGoalDetails>('/api/v1/goal/create', formData);

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the created goal details if successful.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to create new Goal.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve goal details for a user via the backend API
export const getUserGoals = async function (): Promise<IGoalDetails> {
    try {
        // Send a GET request to fetch the user's goal details
        const response = await axiosInstance.get<IGoalDetails>('/api/v1/goal/details');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the goal details if the request was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve the goal details.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve goal details for a user via the backend API
export const getTotalActiveGoalAmount = async function (): Promise<ITotalActiveGoalAmount> {
    try {
        // Send a GET request to fetch the user's goal details
        const response = await axiosInstance.get<ITotalActiveGoalAmount>('/api/v1/goal/total-goal-amount');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the goal details if the request was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve the goal details.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve the longest target time period for incomplete goals associated with the user via the backend API.
export const findLongestTimePeriod = async function (): Promise<ILongestTimePeriod> {
    try {
        // Fetch the longest target time period for incomplete goals via the backend API.
        const response = await axiosInstance.get<ILongestTimePeriod>('/api/v1/goal/longest-time-period');

        // Validate the response and return the data if successful, otherwise throw an error.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve the longest time period details.');
    } catch (error) {
        // Log and re-throw any errors for upstream handling.
        console.error('Error while fetching the longest time period:', error);
        throw error;
    }
};

// Sends a request to analyze goals associated with the user via the backend API.
export const analyzeGoal = async function (): Promise<ISmartAnalysisResult> {
    try {
        // Analyze the goal Data via the backend API 
        const response = await axiosInstance.get<ISmartAnalysisResult>(`/api/v1/goal/analyze`);

        // Validate the response and return the data if successful, otherwise throw an error.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve the longest time period details.');
    } catch (error) {
        // Log and re-throw any errors for upstrema handling 
        console.error(`Error while analyzing the goal Data`, error);
        throw error;
    }
}

// Sends a request to analyze goals associated with the user via the backend API.
export const goalsByCategory = async function (): Promise<ICategoryByGoals> {
    try {
        // Analyze the goal Data via the backend API 
        const response = await axiosInstance.get<ICategoryByGoals>(`/api/v1/goal/by-category`);

        // Validate the response and return the data if successful, otherwise throw an error.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve the longest time period details.');
    } catch (error) {
        // Log and re-throw any errors for upstrema handling 
        console.error(`Error while analyzing the goal Data`, error);
        throw error;
    }
}
