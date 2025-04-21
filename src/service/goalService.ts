import axiosInstance from './axiosInstance';
import { IGoal, IGoalDetails } from '@/types/IGoal';

// Fetches detailed profile information for a user from the backend API
export const createGoal = async function (formData: IGoal): Promise<IGoalDetails> {
    try {
        // Send a GET request to fetch user profile details
        const response = await axiosInstance.post<IGoalDetails>('/api/v1/goal/create', formData);

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the user profile details if successfull.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to create new Goal.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

