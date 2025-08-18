import { z } from 'zod';

const baseSchema = z.object({
    account_name: z.string().trim()
        .min(3, 'Account name must be at least 3 characters')
        .max(50, 'Account name must be less than 50 characters')
        .regex(/^[A-Za-z0-9 ]+$/, 'Account name can only contain letters and numbers'),
    account_type: z.enum(['Bank', 'Debt', 'Investment', 'Cash']),
});

// Bank / Investment / Cash 
const bankLikeSchema = baseSchema.extend({
    current_balance: z.number().min(0, 'Balance cannot be negative'),
    institution: z.string().trim()
        .min(3, 'Account name must be at least 3 characters')
        .max(50, 'Account name must be less than 50 characters')
        .regex(/^[A-Za-z0-9 ]+$/, 'Account name can only contain letters, numbers, and spaces'),
    account_number: z.string()
        .trim()
        .min(6, 'Account number must be at least 6 characters')
        .regex(/^\d+$/, 'Account number must contain only digits'),
})
    
    // description: z.string().optional(),
    //is_active: z.boolean().default(true),
    

    // // Discriminator Field

    // // Bank Account fields
    // current_balance: z.number().min(0, 'Balance cannot be negative').optional(),
    // institution: z.string().optional(),
    // account_number: z.string().optional(),
    // account_subtype: z.enum(['Current', 'Savings', 'FD', 'RD']).optional(),

    // // Debt Account Fields 
    // loan_type: z.enum([
    //     'Mortgage',
    //     'Student',
    //     'Personal',
    //     'Auto',
    //     'Credit Card'
    // ]).optional(),
    // interest_rate: z.number().min(0).max(100).optional(),
    // monthly_payment: z.number().min(0).optional(),
    // due_date: z.string().datetime({ offset: true }).transform(value => new Date(value)).optional(),
    // term_months: z.number().min(0).optional(),

    // // Investment Account Fields 
    // investment_platform: z.string().optional(),
    // portfolio_value: z.number().min(0).optional(),

    // // Liquid Cash Account Fields
    // location: z.enum(['Home', 'Safe', 'Wallet', 'Office']).optional(),

export const accountValidationSchema = z.discriminatedUnion("account_type", [
    bankLikeSchema
]);