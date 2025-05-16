// Predefined enums
export const TRANSACTION_TYPES = [
    'REGULAR',
    'TRANSFER',
    'PAYMENT',
    'ADJUSTMENT',
    'FEE',
    'REFUND',
    'DEPOSIT',
    'WITHDRAWAL',
    'INTEREST',
    'DIVIDEND',
    'REWARD',
    'BONUS',
    'CASHBACK',
    'REDEMPTION',
    'CONVERSION',
    'EXCHANGE',
    'LOAN',
    'BORROWING',
    'LENDING',
    'INVESTMENT',
    'PURCHASE',
    'SALE',
    'EXTRACTION',
] as const;

export type TransactionType = typeof TRANSACTION_TYPES[number];

export const TRANSACTION_CATEGORIES = [
    'FOOD',
    'TRANSPORT',
    'ENTERTAINMENT',
    'HEALTH',
    'EDUCATION',
    'SHOPPING',
    'TRAVEL',
    'BILLS',
    'SUBSCRIPTIONS',
    'GIFTS',
    'SAVINGS',
    'INVESTMENTS',
    'MISCELLANEOUS',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export interface ITransaction {
    _id: string;
    user_id: string;
    account_id: string;
    transaction_type: 'INCOME' | 'EXPENSE',
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    currency: 'INR';
    date: string;
    description: string;
    tags: string[];
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    isDeleted?: boolean;
    related_account_id?: string;
    linked_entities?: Array<{
        entity_id: string;
        entity_type: 'GOAL' | 'DEBT' | 'INVESTMENT' | 'INSURANCE' | 'LOAN' | 'CREDIT_CARD' | 'SAVINGS_ACCOUNT' | 'MORTGAGE' | 'OTHER';
        amount: number;
        currency: string;
    }>;
}

export interface ITransactionDetails {
    success: boolean,
    message: string,
    data: { addedTransaction: ITransaction };
}

export interface ITotalMonthlyIncome {
    success: boolean,
    message: string,
    data: { currentMonthTotal: number, previousMonthTotal: number };
}

export interface ITotalMonthlyExpense {
    success: boolean,
    message: string,
    data: { totalMonthlyExpense: number };
}

export interface ICategoryWiseExpenses {
    success: boolean,
    message: string,
    data: {categoryWiseExpenses: {category: string, value: number}[]};
}

export interface IAllTransactions {
    success: boolean,
    message: string,
    data: { allTransactions: ITransaction[] },
}
