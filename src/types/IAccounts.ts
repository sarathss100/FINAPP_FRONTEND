
export interface IAccount {
    // Common Fields
    _id?: string,
    user_id?: string;
    account_name: string;
    currency: string;
    description?: string;
    is_active: boolean;
    created_by: string;
    last_updated_by?: string;
    createdAt?: Date;
    updatedAt?: Date;

    // Discriminator Field
    account_type?: 'Bank' | 'Debt' | 'Investment' | 'Cash';

    // Bank Account Fields
    current_balance?: number;
    institution?: string;
    account_number?: string;
    account_subtype?: 'Current' | 'Savings' | 'FD' | 'RD';

    // Debt Account Fields
    loan_type?: 'Mortgage' | 'Student' | 'Personal' | 'Auto' | 'Credit Card';
    interest_rate?: number;
    monthly_payment?: number;
    due_date?: Date;
    term_months?: number;

    // Investment Account Fields
    investment_platform?: string;
    portfolio_value?: number;

    // Liquid Cash Account Fields
    location?: 'Home' | 'Safe' | 'Wallet' | 'Office';
}

export interface IAccountDetails {
    success: boolean,
    message: string,
    data: { addedAccount: IAccount };
}

export interface ITotalBalance {
    success: boolean,
    message: string,
    data: { totalBalance: number };
}

export interface ITotalBankBalance {
    success: boolean,
    message: string,
    data: { totalBankBalance: number };
}

export interface ITotalDebt {
    success: boolean,
    message: string,
    data: { totalDebt: number };
}

export interface ITotalInvestment {
    success: boolean,
    message: string,
    data: { totalInvestment: number };
}

export interface IAllAccountDetails {
    success: boolean,
    message: string,
    data: IAccount[];
}

export interface IRemoveAccount {
    success: boolean,
    message: string,
    data: {
        isRemoved: boolean;
    }
}
