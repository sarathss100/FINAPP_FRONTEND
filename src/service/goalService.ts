import ISmartAnalysisResult from '@/types/ISmartAnalysis';
import axiosInstance from './axiosInstance';
import { IGoal, IGoalDetail, IGoalDailyContributionAmount, IGoalDeleted, IGoalDetails, IGoalMonthlyContributionAmount, ILongestTimePeriod, ITotalActiveGoalAmount } from '@/types/IGoal';
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

// Sends a request to delete a specific goal associated with the user via the backend API.
export const deleteGoal = async function (goalId: string): Promise<IGoalDeleted> {
    try {
        // Send a DELETE request to the backend API to delete the goal with the specified `goalId`.
        const response = await axiosInstance.delete<IGoalDeleted>(`/api/v1/goal/delete`, { params: { goalId } });

        // Validate the response and return the data if successful, otherwise throw an error.
        if (response.data && response.data.success) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to delete the goal.');
    } catch (error) {
        // Log the error and re-throw it for upstream handling.
        console.error(`Error while deleting the goal with ID: ${goalId}`, error);
        throw error;
    }
};

// Fetches the user's daily goal contribution analysis from the backend API.
export const getDailyContribution = async function (): Promise<IGoalDailyContributionAmount> {
    try {
        // Send a GET request to retrieve daily contribution data.
        const response = await axiosInstance.get<IGoalDailyContributionAmount>(`/api/v1/goal/daily-contribution`);

        // Return the data if the request was successful; otherwise, throw an error.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve daily contribution details.');
    } catch (error) {
        // Log and rethrow the error for upstream handling.
        console.error(`Error fetching daily contribution data`, error);
        throw error;
    }
}

// Fetches the user's monthly goal contribution analysis from the backend API.
export const getMonthlyContribution = async function (): Promise<IGoalMonthlyContributionAmount> {
    try {
        // Send a GET request to retrieve monthly contribution data.
        const response = await axiosInstance.get<IGoalMonthlyContributionAmount>(`/api/v1/goal/monthly-contribution`);

        // Return the data if the request was successful; otherwise, throw an error.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve monthly contribution details.');
    } catch (error) {
        // Log and rethrow the error for upstream handling.
        console.error(`Error fetching monthly contribution data`, error);
        throw error;
    }
}

// Fetches the detailed information for a specific goal, including monthly contribution analysis, from the backend API.
export const getGoalDetails = async function (goalId: string): Promise<IGoalDetail> {
    try {
        // Send a GET request to retrieve detailed goal data, including monthly contributions, using the provided goalId.
        const response = await axiosInstance.get<IGoalDetail>(`/api/v1/goal/goal-detail`, { params: { goalId } });

        // Return the goal details if the request was successful; otherwise, throw an error with the message from the response or a default error message.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve goal details.');
    } catch (error) {
        // Log the error for debugging purposes and rethrow it to allow upstream error handling.
        console.error(`Error fetching goal details for goalId: ${goalId}`, error);
        throw error;
    }
}
