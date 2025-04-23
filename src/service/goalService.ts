import axiosInstance from './axiosInstance';
import { IGoal, IGoalDetails, ITotalActiveGoalAmount } from '@/types/IGoal';

// Sends a request to create a new goal for a user via the backend API
export const createGoal = async function (formData: IGoal): Promise<IGoalDetails> {
    try {
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
