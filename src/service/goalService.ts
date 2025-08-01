import ISmartAnalysisResult from '@/types/ISmartAnalysis';
import axiosInstance from './axiosInstance';
import { IGoal, IGoalDetail, IGoalDailyContributionAmount, IGoalDeleted, IGoalDetails, IGoalMonthlyContributionAmount, ILongestTimePeriod, ITotalActiveGoalAmount, IGoalTransaction, ITotalInitialGoalAmount } from '@/types/IGoal';
import ICategoryByGoals from '@/types/ICategoryByGoals';

// Sends a request to create a new goal for a user via the backend API
export const createGoal = async function (formData: IGoal): Promise<IGoalDetails> {
    try {
        formData = {...formData, current_amount: (formData.target_amount - formData.initial_investment)}
        // Send a POST request to create a new goal
        const response = await axiosInstance.post<IGoalDetails>('goal', formData);

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
        const response = await axiosInstance.get<IGoalDetails>('goal');

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
        const response = await axiosInstance.get<ITotalActiveGoalAmount>('goal/summary/total');

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
export const getTotalInitialGoalAmount = async function (): Promise<ITotalInitialGoalAmount> {
    try {
        // Send a GET request to fetch the user's goal details
        const response = await axiosInstance.get<ITotalInitialGoalAmount>('goal/summary/initial/total');

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
        const response = await axiosInstance.get<ILongestTimePeriod>('goal/summary/longest-period');

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
        const response = await axiosInstance.get<ISmartAnalysisResult>(`goal/analyze`);

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
        const response = await axiosInstance.get<ICategoryByGoals>(`goal/category`);

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
        const response = await axiosInstance.delete<IGoalDeleted>(`goal/${goalId}`);

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
        const response = await axiosInstance.get<IGoalDailyContributionAmount>(`goal/contributions/daily`);
        
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
        const response = await axiosInstance.get<IGoalMonthlyContributionAmount>(`goal/contributions/monthly`);

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
        const response = await axiosInstance.get<IGoalDetail>(`goal/${goalId}`);

        // Return the goal details if the request was successful; otherwise, throw an error with the message from the response or a default error message.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to retrieve goal details.');
    } catch (error) {
        // Log the error for debugging purposes and rethrow it to allow upstream error handling.
        console.error(`Error fetching goal details for goalId: ${goalId}`, error);
        throw error;
    }
}

// Update the Goal Contribution Transaction History, using the backend API.
export const updateTransaction = async function (goalId: string, amount: number): Promise<IGoalTransaction> {
    try {
        // Send a GET request to update the tranasction in goal data, using the provided goalId.
        const response = await axiosInstance.post<IGoalTransaction>(`goal/${goalId}/transactions`, { goalId, amount });

        // Return the goal tranasction updation status if the request was successful; otherwise, throw an error with the message from the response or a default error message.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to update goal contribution details.');
    } catch (error) {
        // Log the error for debugging purposes and rethrow it to allow upstream error handling.
        console.error(`Error fetching goal details for goalId: ${goalId}`, error);
        throw error;
    }
}

// Update the Goal Contribution Transaction History via the backend API.
export const updateGoal = async function (goalId: string, goalData: Partial<IGoal>): Promise<IGoalTransaction> {
    try {
        // Send a POST request to update the goal with the provided goalId and updated goal data.
        const response = await axiosInstance.put<IGoalTransaction>(`goal/${goalId}`, { goalData });

        // If the update is successful, return the transaction data; otherwise, throw an error.
        if (response.data && response.data.success) return response.data;
        throw new Error(response.data?.message || 'Failed to update goal contribution details.');
    } catch (error) {
        // Log the error for debugging and rethrow it for upstream handling.
        console.error(`Error updating goal with goalId: ${goalId}`, error);
        throw error;
    }
}
