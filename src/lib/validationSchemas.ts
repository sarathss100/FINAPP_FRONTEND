import { z } from 'zod';

export const signupSchema = z.object({
    first_name: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
    last_name: z.string().min(2, { message: 'Last name must be at least 2 characters long' }),
    phone_number: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm_password: z.string().min(8, { message: 'Confirm Password is required' }),
    terms: z.boolean({
        required_error: 'You must agree to the terms and conditions',
    }).refine((val) => val === true, { message: 'You must agree to the terms' }),
})
    .refine((data) => data.password === data.confirm_password, {
        message: 'Password do not match',
        path: ['confirm_password']
    });

// Infer the type from the schema
export type SignupFormValues = z.infer<typeof signupSchema>;


export const signInSchema = z.object({
    phone_number: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

// Infer the type from the schema
export type SignInFormValues = z.infer<typeof signInSchema>;


export const PhoneNumberVerifySchema = z.object({
    phone_number: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
});

// Infer the type from the schema
export type PhoneNumberFormValues = z.infer<typeof PhoneNumberVerifySchema>;

export const resetPasswordSchema = z.object({
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        confirm_password: z.string().min(8, { message: 'Confirm Password is required' }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Password do not match',
        path: ['confirm_password']
    });

// Infer the type from the schema
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const goalSchema = z.object({
    tenant_id: z.string().optional(),
    goal_name: z
        .string()
        .min(3, 'Goal name must be at least 3 characters')
        .max(255, 'Goal name cannot exced 255 characters'),
    goal_category: z
        .enum(['Education', 'Retirement', 'Travel', 'Investment', 'Other'])
        .nullable().optional(),
    target_amount: z.number().min(0, 'Target amount must be non-negative.'),
    initial_investment: z.number().min(0, 'Initial investment must be non-negative.'),
    currency: z.enum(['USD', 'EUR', 'INR', 'GBP']).default('INR'),
    target_date: z
        .date()
        .refine((date) => date > new Date(), 'Target date must be in the future'),
    contribution_frequency: z.enum(['Monthly', 'Quaterly', 'Yearly']),
    priority_level: z.enum(['Low', 'Medium', 'High']).nullable().optional(),
    description: z.string().optional(),
    reminder_frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'None']).nullable().optional(),
    goal_type: z.enum(['Savings', 'Investment', 'Debt Repayment', 'Other']).nullable().optional(),
    tags: z.array(z.string().trim()).optional(),
    dependencies: z.array(z.string().min(1, 'Dependency ID must be valid')).optional(),
    is_completed: z.boolean().default(false),
    created_by: z.string().min(1, 'Created by user ID is required.').optional(),
    last_updated_by: z.string().optional(),
}).refine(
    (data) => data.initial_investment < data.target_amount,
    {
        message: `Intial investment cannot exceed the target amount.`,
        path: ['initial_investment'],
    }
).refine(
    (data) => {
        const timeDifferenceInMonths = (data.target_date.getTime() - Date.now() / (1000 * 60 * 60 * 24 * 30));
        if (data.contribution_frequency === 'Yearly' && timeDifferenceInMonths < 12) return false;
        if (data.contribution_frequency === 'Quaterly' && timeDifferenceInMonths < 3) return false;
        return true;
    }, 
    {
        message: `Contribution frequency is not feasible given the target date.`,
        path: ['contribution_frequency'],
    }
).refine(
    (data) => {
        const timeDifferenceInDays = (data.target_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        if (data.reminder_frequency === 'Daily' && timeDifferenceInDays > 365) return false;
        return true;
    },
    {
        message: `Reminder frequency is not practical given the target date.`,
        path: ['reminder_frequency'],
    }
)

// Infer the type from the schema
export type GoalFormValues = z.infer<typeof goalSchema>;
