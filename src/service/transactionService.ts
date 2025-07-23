import { CommonflowTable, IAllExpenseTransactions, IAllIncomeTransactions, IAllTransactions, ICategoryWiseExpenses, IMonthlyExpenseTrends, IMonthlyIncomeTrends, InflowTable, IParsedTransactions, ITotalMonthlyExpense, ITotalMonthlyIncome, ITransaction, ITransactionDetails } from '@/types/ITransaction';
import axiosInstance from './axiosInstance';

// Sends a request to add a new transaction for a user via the backend API
export const addTransaction = async function (formData: ITransaction | ITransaction[]): Promise<ITransactionDetails> {
    try {
        // Send a POST request to add a transaction
        const response = await axiosInstance.post<ITransactionDetails>('transaction', formData);
    
        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the added transaction details if successful.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to add Transaction.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Fetches the total income for the current and previous month for the authenticated user.
export const getTotalMonthlyIncome = async function (): Promise<ITotalMonthlyIncome> {
    try {
        // Send a GET request to fetch the monthly income totals from the backend API
        const response = await axiosInstance.get<ITotalMonthlyIncome>('transaction/summary/monthly/income');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the monthly income totals if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch monthly income totals.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

/**
 * Fetches the total expense amount for the current month
 * for the authenticated user.
 */
export const getTotalMonthlyExpense = async function (): Promise<ITotalMonthlyExpense> {
    try {
        // Send a GET request to fetch the monthly expense totals from the backend API
        const response = await axiosInstance.get<ITotalMonthlyExpense>('transaction/summary/monthly/expense');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the monthly expense totals if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch monthly expense totals.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

/**
 * Fetches the **category-wise expense breakdown** for the current month
 * for the authenticated user.
 */
export const getCategoryWiseExpenses = async function (): Promise<ICategoryWiseExpenses> {
    try {
        // Send a GET request to fetch the category-wise expense data from the backend API
        const response = await axiosInstance.get<ICategoryWiseExpenses>('transaction/summary/category');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the category-wise expense data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch category-wise expense data.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

/**
 * Fetches the total expense amount for the current month
 * for the authenticated user.
 */
export const getAllTransactions = async function (): Promise<IAllTransactions> {
    try {
        // Send a GET request to fetch the monthly expense totals from the backend API
        const response = await axiosInstance.get<IAllTransactions>('transaction');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the monthly expense totals if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch monthly expense totals.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

// Uploads a bank statement file and extracts structured transaction data from it.
export const extractStatementData = async function (file: FormData): Promise<IParsedTransactions> {
    try {
        // Send a POST request to extract the data from the backend API
        const response = await axiosInstance.post<IParsedTransactions>('transaction/statement', file,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the extracted data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to extract the Data from the file');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

// Fetches the monthly income trends summary from the backend API.
export const getMonthlyIncomeTrends = async function (): Promise<IMonthlyIncomeTrends> {
    try {
        // Send a GET request to fetch the monthly income trends from the backend API
        const response = await axiosInstance.get<IMonthlyIncomeTrends>('transaction/summary/income-by-month');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the parsed data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch monthly income trends');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

// Fetches the monthly expense trends summary from the backend API.
export const getMonthlyExpenseTrends = async function (): Promise<IMonthlyExpenseTrends> {
    try {
        // Send a GET request to fetch the monthly expense trends from the backend API
        const response = await axiosInstance.get<IMonthlyExpenseTrends>('transaction/summary/expense-by-month');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the parsed data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch monthly expense trends');
        }
    } catch (error) {
        // Re-throw the error for upstream handling without modifying it
        throw error;
    }
};

// Fetches all income transactions for the authenticated user.
export const getAllIncomeTransactions = async function (): Promise<IAllIncomeTransactions> {
    try {
        // Send a GET request to fetch income transactions from the backend API
        const response = await axiosInstance.get<IAllIncomeTransactions>('transaction/income/transactions');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the transaction data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch income transactions.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Fetches all expense transactions for the authenticated user.
export const getAllExpenseTransactions = async function (): Promise<IAllExpenseTransactions> {
    try {
        // Send a GET request to fetch expense transactions from the backend API
        const response = await axiosInstance.get<IAllExpenseTransactions>('transaction/expense/transactions');

        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the transaction data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to fetch expense transactions.');
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Fetches income transaction data for the inflow table view.
export const fetchInflowTable = async function (
    page: number = 1,
    limit: number,
    timeRange: string = 'year',
    category?: string,
    searchText?: string
  ): Promise<InflowTable> {
    try {
      // Construct query parameters dynamically, omitting undefined/null values
      const params = new URLSearchParams();
  
      params.append('page', page.toString());
      params.append('timeRange', timeRange);
  
        if (limit) params.append('limit', limit.toString());
      if (category) params.append('category', category);
      if (searchText) params.append('searchText', searchText);
  
      // Send a GET request to fetch income transactions from the backend API
      const response = await axiosInstance.get<InflowTable>(
        `transaction/income/summary?${params.toString()}`
      );
  
      // Validate the response structure and success flag
      if (response.data && response.data.success) {
        return response.data; // Return the transaction data if successful
      } else {
        // Throw an error if the response indicates failure
        throw new Error(response.data?.message || 'Failed to fetch income transactions.');
      }
    } catch (error) {
      // Re-throw the error for upstream handling
      throw error;
    }
}

// Fetches expense transaction data for the outflow table view.
export const fetchOutflowTable = async function (
    page: number = 1,
    limit: number = 5,
    timeRange: string = 'year',
    category?: string,
    searchText?: string
  ): Promise<InflowTable> {
    try {
      // Construct query parameters dynamically, omitting undefined/null values
      const params = new URLSearchParams();
  
      params.append('page', page.toString());
      params.append('timeRange', timeRange);
  
      if (limit) params.append('limit', limit.toString());
      if (category) params.append('category', category);
      if (searchText) params.append('searchText', searchText);
  
      // Send a GET request to fetch expense transactions from the backend API
      const response = await axiosInstance.get<InflowTable>(
        `transaction/expense/summary?${params.toString()}`
      );
  
      // Validate the response structure and success flag
      if (response.data && response.data.success) {
        return response.data; // Return the transaction data if successful
      } else {
        // Throw an error if the response indicates failure
        throw new Error(response.data?.message || 'Failed to fetch expense transactions.');
      }
    } catch (error) {
      // Re-throw the error for upstream handling
      throw error;
    }
}
  
// Fetches expense transaction data for the outflow table view.
export const fetchCommonflowTable = async function (
    page: number = 1,
    limit: number = 5,
    timeRange: string = 'year',
    category?: string,
    transactionType?: string,
    searchText?: string
): Promise<CommonflowTable> {
    try {
      // Construct query parameters dynamically, omitting undefined/null values
      const params = new URLSearchParams();
  
      params.append('page', page.toString());
      params.append('timeRange', timeRange);
  
      if (limit) params.append('limit', limit.toString());
      if (category) params.append('category', category);
      if (transactionType) params.append('transactionType', transactionType);
      if (searchText) params.append('searchText', searchText);
  
      // Send a GET request to fetch expense transactions from the backend API
      const response = await axiosInstance.get<CommonflowTable>(
        `transaction/all?${params.toString()}`
      );
  
      // Validate the response structure and success flag
      if (response.data && response.data.success) {
        return response.data; // Return the transaction data if successful
      } else {
        // Throw an error if the response indicates failure
        throw new Error(response.data?.message || 'Failed to fetch expense transactions.');
      }
    } catch (error) {
      // Re-throw the error for upstream handling
      throw error;
    }
}
