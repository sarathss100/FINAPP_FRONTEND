import { IAllDebtDetails, IDebt, IDebtCategoryDetails, IDebtDetails, ILongestTenureDetails, IMarkAsPaidDebtDetails, IRemoveDebtDetails, IRepaymentSimulationDetails, ITotalDebtDetails, ITotalMonthlyPaymentDetails, ITotalOutstandingAmountDetails } from '@/types/IDebt';
import axiosInstance from './axiosInstance';

// Creates a new debt entry for the authenticated user.
export const createDebt = async function (formData: IDebt): Promise<IDebtDetails> {
    try {
        // Send a POST request to create debt 
        const response = await axiosInstance.post<IDebtDetails>(`debt`, { ...formData });
    
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

// Fetches the total outstanding debt amount for the authenticated user.
export const getTotalDebtExist = async function (): Promise<ITotalDebtDetails> {
    try {
        // Send a GET request to fetch total debt data
        const response = await axiosInstance.get<ITotalDebtDetails>(`debt/total`);
        
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

export const getTotalOutstandingAmount = async function (): Promise<ITotalOutstandingAmountDetails> {
    try {
        // Send a GET request to fetch debt summary
        const response = await axiosInstance.get<ITotalOutstandingAmountDetails>(`debt/summary`);
    
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

// Fetches the total monthly payment across all debts for the authenticated user.
export const getTotalMonthlyPayment = async function (): Promise<ITotalMonthlyPaymentDetails> {
    try {
        const response = await axiosInstance.get<ITotalMonthlyPaymentDetails>(`debt/monthly-payment`);
    
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to fetch monthly payment data.');
        }
    } catch (error) {
        throw error;
    }
};

// Fetches the longest remaining tenure among all active debts for the authenticated user.
export const getLongestTenure = async function (): Promise<ILongestTenureDetails> {
    try {
        // Send a GET request to fetch the longest debt tenure
        const response = await axiosInstance.get<ILongestTenureDetails>(`debt/tenure`);
    
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

// Fetches all active "Good Debts" for the authenticated user.
export const getGoodDebts = async function (): Promise<IDebtCategoryDetails> {
    try {
        // Send a GET request to fetch good debts
        const response = await axiosInstance.get<IDebtCategoryDetails>(`debt?category=good`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return categorized debt data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch good debts.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Fetches all active "Bad Debts" for the authenticated user.
export const getBadDebts = async function (): Promise<IDebtCategoryDetails> {
    try {
        // Send a GET request to fetch bad debts
        const response = await axiosInstance.get<IDebtCategoryDetails>(`debt?category=bad`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return categorized debt data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch bad debts.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Fetches the debt repayment strategy comparison result for the authenticated user.
export const getRepaymentSimulationResult = async function (): Promise<IRepaymentSimulationDetails> {
    try {
        // Send a GET request to fetch repayment simulation result
        const response = await axiosInstance.get<IRepaymentSimulationDetails>(`debt/simulation?extraAmount=1000`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return simulation result if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch repayment simulation result.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Fetches all debt details for the authenticated user.
export const getAllDebts = async function (): Promise<IAllDebtDetails> {
    try {
        const response = await axiosInstance.get<IAllDebtDetails>(`debt/all`);
    
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to fetch debt details.');
        }
    } catch (error) {
        throw error;
    }
};

// Removes a specific debt record by its unique identifier.
export const removeDebt = async function (debtId: string): Promise<IRemoveDebtDetails> {
    try {
        const response = await axiosInstance.delete<IRemoveDebtDetails>(`debt/${debtId}`);
    
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to remove the debt.');
        }
    } catch (error) {
        throw error;
    }
};


// Marks a specific debt as paid by updating its due date and status on the server.
export const markAsPaid = async function (debtId: string): Promise<IMarkAsPaidDebtDetails> {
    try {
        const response = await axiosInstance.patch<IMarkAsPaidDebtDetails>(`debt/${debtId}`);

        if (response.data && response.data.success) {
            return response.data; 
        } else {
            throw new Error(response.data?.message || 'Failed to mark the debt as paid.');
        }
    } catch (error) {
        throw error;
    }
};
