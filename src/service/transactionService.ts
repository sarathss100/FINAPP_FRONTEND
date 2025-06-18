import { CommonflowTable, IAllExpenseTransactions, IAllIncomeTransactions, IAllTransactions, ICategoryWiseExpenses, IMonthlyExpenseTrends, IMonthlyIncomeTrends, InflowTable, IParsedTransactions, ITotalMonthlyExpense, ITotalMonthlyIncome, ITransaction, ITransactionDetails } from '@/types/ITransaction';
import axiosInstance from './axiosInstance';

// Sends a request to add a new transaction for a user via the backend API
export const addTransaction = async function (formData: ITransaction | ITransaction[]): Promise<ITransactionDetails> {
    try {
        // Send a POST request to add a transaction
        const response = await axiosInstance.post<ITransactionDetails>('/api/v1/transaction', formData);
    
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

/**
 * Fetches the total income for the current and previous month for the authenticated user.
 *
 * Makes an API request to retrieve calculated monthly income data from the backend,
 * specifically for the currently authenticated user (based on the session or token).
 *
 * @returns {Promise<ITotalMonthlyIncome>} A promise resolving to an object containing:
 *   - `currentMonthTotal`: Total income for the current month
 *   - `previousMonthTotal`: Total income for the previous month
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
export const getTotalMonthlyIncome = async function (): Promise<ITotalMonthlyIncome> {
    try {
        // Send a GET request to fetch the monthly income totals from the backend API
        const response = await axiosInstance.get<ITotalMonthlyIncome>('/api/v1/transaction/summary/monthly/income');

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
 *
 * Makes an API request to retrieve calculated monthly expense data from the backend,
 * specifically for the currently authenticated user (based on session or token).
 *
 * @returns {Promise<ITotalMonthlyExpense>} A promise resolving to an object containing:
 *   - `currentMonthTotal`: Total expense amount for the current month
 *   - `previousMonthTotal`: Total expense amount for the previous month
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
export const getTotalMonthlyExpense = async function (): Promise<ITotalMonthlyExpense> {
    try {
        // Send a GET request to fetch the monthly expense totals from the backend API
        const response = await axiosInstance.get<ITotalMonthlyExpense>('/api/v1/transaction/summary/monthly/expense');

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
 *
 * Makes an API request to retrieve categorized monthly expense data from the backend,
 * grouped by transaction categories (e.g., FOOD, TRANSPORT, etc.),
 * specifically for the currently authenticated user (based on session or token).
 *
 * @returns {Promise<ICategoryWiseExpenses>} A promise resolving to an object containing:
 *   - `success`: Boolean indicating whether the request was successful
 *   - `data`: An array of objects with:
 *     - `category`: The name of the transaction category
 *     - `value`: The total amount spent in that category during the current month
 *   - `message`: A descriptive message (usually on error)
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
export const getCategoryWiseExpenses = async function (): Promise<ICategoryWiseExpenses> {
    try {
        // Send a GET request to fetch the category-wise expense data from the backend API
        const response = await axiosInstance.get<ICategoryWiseExpenses>('/api/v1/transaction/summary/category');

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
 *
 * Makes an API request to retrieve calculated monthly expense data from the backend,
 * specifically for the currently authenticated user (based on session or token).
 *
 * @returns {Promise<ITotalMonthlyExpense>} A promise resolving to an object containing:
 *   - `currentMonthTotal`: Total expense amount for the current month
 *   - `previousMonthTotal`: Total expense amount for the previous month
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
export const getAllTransactions = async function (): Promise<IAllTransactions> {
    try {
        // Send a GET request to fetch the monthly expense totals from the backend API
        const response = await axiosInstance.get<IAllTransactions>('/api/v1/transaction');

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
 * Uploads a bank statement file and extracts structured transaction data from it.
 *
 * This function sends the uploaded file to the backend API to be parsed and normalized
 * into a standardized format containing the list of transactions.
 *
 * Supported file formats include:
 * - CSV
 * - XLSX, XLS, XLSM (Excel files)
 *
 * @param {FormData} file - The form data containing the uploaded file.
 * @returns {Promise<IParsedTransactions>}
 *   A promise resolving to an object containing the parsed transaction data.
 *
 * @throws {Error} If the file upload or parsing fails on the server side.
 */
export const extractStatementData = async function (file: FormData): Promise<IParsedTransactions> {
    try {
        // Send a POST request to extract the data from the backend API
        const response = await axiosInstance.post<IParsedTransactions>('/api/v1/transaction/statement', file,{
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

/**
 * Fetches the monthly income trends summary from the backend API.
 *
 * This function sends a GET request to retrieve a precomputed summary
 * of income grouped by month. It returns structured data conforming
 * to the IMonthlyIncomeTrends interface.
 *
 * @returns {Promise<IMonthlyIncomeTrends>}
 *   A promise resolving to an object containing the monthly income trends.
 *
 * @throws {Error}
 *   If the request fails or if the server responds with a non-success status,
 *   including validation or parsing errors on the backend side.
 */
export const getMonthlyIncomeTrends = async function (): Promise<IMonthlyIncomeTrends> {
    try {
        // Send a GET request to fetch the monthly income trends from the backend API
        const response = await axiosInstance.get<IMonthlyIncomeTrends>('/api/v1/transaction/summary/income-by-month');

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

/**
 * Fetches the monthly expense trends summary from the backend API.
 *
 * This function sends a GET request to retrieve a precomputed summary
 * of expenses grouped by month. It returns structured data conforming
 * to the IMonthlyExpenseTrends interface.
 *
 * @returns {Promise<IMonthlyExpenseTrends>}
 *   A promise resolving to an object containing the monthly expense trends.
 *
 * @throws {Error}
 *   If the request fails or if the server responds with a non-success status,
 *   including validation or parsing errors on the backend side.
 */
export const getMonthlyExpenseTrends = async function (): Promise<IMonthlyExpenseTrends> {
    try {
        // Send a GET request to fetch the monthly expense trends from the backend API
        const response = await axiosInstance.get<IMonthlyExpenseTrends>('/api/v1/transaction/summary/expense-by-month');

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

/**
 * Fetches all income transactions for the authenticated user.
 *
 * Makes an API request to retrieve the list of income transactions
 * for the currently authenticated user (based on session or token).
 *
 * @returns {Promise<IAllIncomeTransactions>} A promise resolving to an object containing:
 *   - `transactions`: Array of income transaction objects
 *   - Additional metadata or flags as defined in the `IAllInomeTransactions` interface
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
export const getAllIncomeTransactions = async function (): Promise<IAllIncomeTransactions> {
    try {
        // Send a GET request to fetch income transactions from the backend API
        const response = await axiosInstance.get<IAllIncomeTransactions>('/api/v1/transaction/income/transactions');

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

/**
 * Fetches all expense transactions for the authenticated user.
 *
 * Makes an API request to retrieve the list of expense transactions
 * for the currently authenticated user (based on session or token).
 *
 * @returns {Promise<IAllExpenseTransactions>} A promise resolving to an object containing:
 *   - `transactions`: Array of expense transaction objects
 *   - Additional metadata or flags as defined in the `IAllExpenseTransactions` interface
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
export const getAllExpenseTransactions = async function (): Promise<IAllExpenseTransactions> {
    try {
        // Send a GET request to fetch expense transactions from the backend API
        const response = await axiosInstance.get<IAllExpenseTransactions>('/api/v1/transaction/expense/transactions');

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

/**
 * Fetches income transaction data for the inflow table view.
 *
 * Makes an API request to retrieve structured income transaction data
 * used specifically for displaying the inflow table to the authenticated user.
 * Supports pagination and optional filtering via query parameters.
 *
 * @param {number} [page=1] - The page number to fetch (for pagination).
 * @param {number} [limit=5] - The number of items per page.
 * @param {string} [timeRange='year'] - Time range filter (e.g., 'year', 'month', 'week').
 * @param {string} [category] - Optional category to filter income transactions.
 * @param {string} [searchText] - Optional text to search within transaction fields.
 *
 * @returns {Promise<InflowTable>} A promise resolving to an object containing:
 *   - `transactions`: Array of income transaction objects
 *   - Additional metadata or UI-specific fields as defined in the `InflowTable` interface
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
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
        `/api/v1/transaction/income/summary?${params.toString()}`
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

/**
 * Fetches expense transaction data for the outflow table view.
 *
 * Makes an API request to retrieve structured expense transaction data
 * used specifically for displaying the outflow table to the authenticated user.
 * Supports pagination and optional filtering via query parameters.
 *
 * @param {number} [page=1] - The page number to fetch (for pagination).
 * @param {number} [limit=5] - The number of items per page.
 * @param {string} [timeRange='year'] - Time range filter (e.g., 'year', 'month', 'week').
 * @param {string} [category] - Optional category to filter expense transactions.
 * @param {string} [searchText] - Optional text to search within transaction fields.
 *
 * @returns {Promise<InflowTable>} A promise resolving to an object containing:
 *   - `transactions`: Array of expense transaction objects
 *   - Additional metadata or UI-specific fields as defined in the `InflowTable` interface
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
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
        `/api/v1/transaction/expense/summary?${params.toString()}`
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
  
/**
 * Fetches expense transaction data for the outflow table view.
 *
 * Makes an API request to retrieve structured expense transaction data
 * used specifically for displaying the outflow table to the authenticated user.
 * Supports pagination and optional filtering via query parameters.
 *
 * @param {number} [page=1] - The page number to fetch (for pagination).
 * @param {number} [limit=5] - The number of items per page.
 * @param {string} [timeRange='year'] - Time range filter (e.g., 'year', 'month', 'week').
 * @param {string} [category] - Optional category to filter expense transactions.
 * @param {string} [searchText] - Optional text to search within transaction fields.
 *
 * @returns {Promise<InflowTable>} A promise resolving to an object containing:
 *   - `transactions`: Array of expense transaction objects
 *   - Additional metadata or UI-specific fields as defined in the `InflowTable` interface
 *
 * @throws {Error} If the API request fails or returns a non-success response.
 */
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
        `/api/v1/transaction/all?${params.toString()}`
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
