import { IAccount, IAccountDetails, IAllAccountDetails, IRemoveAccount, ITotalBalance, ITotalBankBalance, ITotalDebt, ITotalInvestment } from '@/types/IAccounts';
import axiosInstance from './axiosInstance';

// Sends a request to add a new account for a user via the backend API
export const addAccount = async function (formData: IAccount): Promise<IAccountDetails> {
    try {
        // Send a POST request to add a account
        const response = await axiosInstance.post<IAccountDetails>('accounts', formData);

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the added account details if successful.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to add Account.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve account total balance details for a user via the backend API
export const getTotalBalance = async function (): Promise<ITotalBalance> {
    try {
        // Send a GET request to fetch the user's account total balance
        const response = await axiosInstance.get<ITotalBalance>('accounts/balance');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the total balance details if the request was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve the account details.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve account total bank balance details for a user via the backend API
export const getTotalBankBalance = async function (): Promise<ITotalBankBalance> {
    try {
        // Send a GET request to fetch the user's account total bank balance
        const response = await axiosInstance.get<ITotalBankBalance>('accounts/bank-balance');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the total bank balance details if the request was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve the bank balance.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve account total debt details for a user via the backend API
export const getTotalDebt = async function (): Promise<ITotalDebt> {
    try {
        // Send a GET request to fetch the user's account total debt
        const response = await axiosInstance.get<ITotalDebt>('accounts/debt');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the total debt details if the request was successfull
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve the total debt.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve account total investment details for a user via the backend API
export const getTotalInvestment = async function (): Promise<ITotalInvestment> {
    try {
        // Send a GET request to fetch the user's account total investment
        const response = await axiosInstance.get<ITotalInvestment>('accounts/investment');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the total investment details if the request was successfull
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve the total investment.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to retrieve all account details for the authenticated user via the backend API.
export const getUserAccounts = async function (): Promise<IAllAccountDetails> {
    try {
        // Send a GET request to fetch the user's account details
        const response = await axiosInstance.get<IAllAccountDetails>('accounts');

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the account details if the request was successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to retrieve user account details.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Sends a request to delete a specific account associated with the user via the backend API.
export const removeAccount = async function (accountId: string): Promise<IRemoveAccount> {
    try {
        // Send a DELETE request to the backend API to delete the account with the specified `accountId`.
        const response = await axiosInstance.delete<IRemoveAccount>(`accounts/${accountId}`);

        // Validate the response and return the data if successful, otherwise throw an error.
        if (response.data && response.data.success) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to delete the account.');
    } catch (error) {
        // Log the error and re-throw it for upstream handling.
        console.error(`Error while deleting the account with ID: ${accountId}`, error);
        throw error;
    }
};

// Sends a request to delete a specific account associated with the user via the backend API.
export const updateAccount = async function (accountId: string, accountData: IAccount): Promise<IRemoveAccount> {
    try {
        // Send a DELETE request to the backend API to delete the account with the specified `accountId`.
        const response = await axiosInstance.put<IRemoveAccount>(`accounts/${accountId}`, { accountData });

        // Validate the response and return the data if successful, otherwise throw an error.
        if (response.data && response.data.success) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to delete the account.');
    } catch (error) {
        // Log the error and re-throw it for upstream handling.
        console.error(`Error while deleting the account with ID: ${accountId}`, error);
        throw error;
    }
};
