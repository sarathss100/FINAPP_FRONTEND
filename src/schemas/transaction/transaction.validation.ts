import { z } from 'zod';

// Define the Zod Schema for Entity DTO 
const LinkedEntityDTO = z.object({
    entity_id: z.string().min(1, 'Entity ID is required.').optional(),
    entity_type: z.enum(['GOAL', 'DEBT', 'INVESTMENT', 'INSURANCE', 'TAX_GROUP', 'LOAN', 'CREDIT_CARD', 'SAVINGS_ACCOUNT', 'CHECKING_ACCOUNT', 'MORTGAGE', 'OTHER']).optional(),
    amount: z.number().min(0, 'Amount must be non-negative.').optional(),
    currency: z.enum(['INR']).default('INR').optional(),
});

// Define the Zod Schema for Transaction DTO
const transactionDTOSchema = z.object({
    _id: z.string().optional(),
    user_id: z.string().optional(),
    account_id: z.string().min(1, 'Account ID is required'),
    transaction_type: z.enum(['INCOME', 'EXPENSE']),
    type: z.enum(['REGULAR', 'TRANSFER', 'PAYMENT', 'ADJUSTMENT', 'FEE', 'REFUND', 'DEPOSIT', 'WITHDRAWAL', 'INTEREST', 'DIVIDEND', 'REWARD', 'BONUS', 'CASHBACK', 'REDEMPTION', 'CONVERSION', 'EXCHANGE', 'LOAN', 'BORROWING', 'LENDING', 'INVESTMENT', 'PURCHASE', 'SALE', 'EXTRACTION', 'INCOME', 'EXPENSE', 'RENT', 'ENTERTAINMENT', 'EDUCATION', 'BILLS', 'SUBSCRIPTIONS', 'TRAVEL']),
    category: z.enum(['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'SHOPPING', 'TRAVEL', 'BILLS', 'SUBSCRIPTIONS', 'GIFTS', 'SAVINGS', 'INVESTMENTS', 'MISCELLANEOUS', 'RENT']),
    amount: z.number().min(0, 'Amount must be non-negative.'),
    credit_amount: z.number().min(0, `Amount must be non-negative`).optional(),
    debit_amount: z.number().min(0, 'Amount must be non-negative').optional(),
    closing_balance: z.number().min(0, 'Amount must be non-negative').optional(),
    currency: z.enum(['USD', 'EUR', 'INR', 'GBP']).default('INR'),
    date: z.string().default(() => new Date().toISOString()).transform((val) => new Date(val)),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).default('PENDING'),
    related_account_id: z.string().optional(),   
    transactionHash: z.string().optional(),
    linked_entities: z.array(LinkedEntityDTO).default([]).optional(),
    isDeleted: z.boolean().default(false),
    deletedAt: z.date().optional(),
    createdAt: z.string().default(() => new Date().toISOString()).transform((val) => new Date(val)).optional(),
    updatedAt: z.string().default(() => new Date().toISOString()).transform((val) => new Date(val)).optional(),
});

// Export the schema for reuse in other parts of the application
export default transactionDTOSchema;

export interface IParsedTransactionDTO {
    date: Date | null;
    description: string;
    transaction_id: string;
    debit_amount?: number;
    credit_amount?: number;
    transaction_type: 'income' | 'expense' | 'unknown';
    amount: number;
    closing_balance: number | null;
}
