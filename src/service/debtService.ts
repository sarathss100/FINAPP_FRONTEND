import { IAllDebtDetails, IDebt, IDebtCategoryDetails, IDebtDetails, ILongestTenureDetails, IMarkAsPaidDebtDetails, IRemoveDebtDetails, IRepaymentSimulationDetails, ITotalDebtDetails, ITotalMonthlyPaymentDetails, ITotalOutstandingAmountDetails } from '@/types/IDebt';
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

/**
 * Fetches all active "Good Debts" for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve debts categorized as 'Good Debt'.
 *
 * @returns {Promise<IDebtCategoryDetails>} A promise resolving to an object containing
 *                                          categorized debt details for "Good Debts".
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getGoodDebts = async function (): Promise<IDebtCategoryDetails> {
    try {
        // Send a GET request to fetch good debts
        const response = await axiosInstance.get<IDebtCategoryDetails>(`/api/v1/debt?category=good`);
    
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

/**
 * Fetches all active "Bad Debts" for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve debts categorized as 'Bad Debt'.
 *
 * @returns {Promise<IDebtCategoryDetails>} A promise resolving to an object containing
 *                                          categorized debt details for "Bad Debts".
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getBadDebts = async function (): Promise<IDebtCategoryDetails> {
    try {
        // Send a GET request to fetch bad debts
        const response = await axiosInstance.get<IDebtCategoryDetails>(`/api/v1/debt?category=bad`);
    
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

/**
 * Fetches the debt repayment strategy comparison result for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve a simulation of repayment strategies,
 * such as the Avalanche and Snowball methods, including total months, interest paid, and monthly payments.
 *
 * @returns {Promise<IRepaymentSimulationDetails>} A promise resolving to an object containing
 *                                             detailed repayment simulation results.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getRepaymentSimulationResult = async function (): Promise<IRepaymentSimulationDetails> {
    try {
        // Send a GET request to fetch repayment simulation result
        const response = await axiosInstance.get<IRepaymentSimulationDetails>(`/api/v1/debt/simulation?extraAmount=1000`);
    
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

/**
 * Fetches all debt details for the authenticated user.
 * Sends a GET request to the backend API endpoint to retrieve detailed information about each debt,
 * including balance, interest rate, minimum payment, and potentially other metadata.
 *
 * @returns {Promise<IAllDebtDetails>} A promise resolving to an object containing detailed debt information.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const getAllDebts = async function (): Promise<IAllDebtDetails> {
    try {
        // Send a GET request to fetch all debt details
        const response = await axiosInstance.get<IAllDebtDetails>(`/api/v1/debt/all`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return debt details if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch debt details.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Removes a specific debt record by its unique identifier.
 * Sends a DELETE request to the backend API endpoint to soft-delete or permanently remove
 * the specified debt associated with the authenticated user.
 *
 * @param {string} debtId - The unique identifier of the debt to be removed.
 * @returns {Promise<IRemoveDebtDetails>} A promise resolving to an object containing the result of the removal operation.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const removeDebt = async function (debtId: string): Promise<IRemoveDebtDetails> {
    try {
        // Send a DELETE request to remove the specified debt
        const response = await axiosInstance.delete<IRemoveDebtDetails>(`/api/v1/debt/${debtId}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return result if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to remove the debt.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};


/**
 * Marks a specific debt as paid by updating its due date and status on the server.
 * Sends a PATCH request to the backend API endpoint to update the specified debt,
 * typically by moving its 'nextDueDate' to the next billing cycle and resetting the 'isExpired' flag.
 *
 * @param {string} debtId - The unique identifier of the debt to be marked as paid.
 * @returns {Promise<IMarkAsPaidDebtDetails>} A promise resolving to an object containing the result of the update operation.
 * @throws {Error} Throws an error if the API request fails or returns a non-success response.
 */
export const markAsPaid = async function (debtId: string): Promise<IMarkAsPaidDebtDetails> {
    try {
        // Send a PATCH request to mark the debt as paid
        const response = await axiosInstance.patch<IMarkAsPaidDebtDetails>(`/api/v1/debt/${debtId}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return result if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to mark the debt as paid.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};
