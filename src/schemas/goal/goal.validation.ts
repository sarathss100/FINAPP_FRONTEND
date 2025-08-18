import { z } from 'zod';

// Define the Zod Schema for Goal DTO
const goalDTOSchema = z.object({
    _id: z.string().optional(),
    user_id: z.string().optional(),
    tenant_id: z.string().optional(),
    goal_name: z.string().min(3, 'Goal name must be at least 3 characters').max(255),
    goal_category: z.enum(['Education', 'Retirement', 'Travel', 'Investment', 'Other']).default('Other'),
    target_amount: z.number().min(0, 'Target amount must be non-negative.'),
    initial_investment: z.number().min(0, 'Initial investment must be non-negative.'),
    current_amount: z.number().min(0, 'Curent amount must be non-negative.').optional(),
    currency: z.enum(['USD', 'EUR', 'INR', 'GBP']).default('INR'),
    target_date: z.string().datetime({ offset: true }).transform(value => new Date(value)).refine(date => date > new Date(), { message: 'Target data must be in the future' }),
    contribution_frequency: z.enum(['Monthly', 'Quarterly', 'Yearly']),
    priority_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
    description: z.string().optional(),
    reminder_frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'None']).default('None'),
    goal_type: z.enum(['Savings', 'Investment', 'Debt Repayment', 'Other']).default('Savings'),
    tags: z.array(z.string().trim()).optional(),
    dependencies: z.array(z.string().min(1, 'Dependency ID must be valid.')).optional(),
    is_completed: z.boolean(),
    created_by: z.string().min(1, 'Created by user ID is required.').optional(),
    last_updated_by: z.string().optional(),
    dailyContribution: z.number().optional(),
    monthlyContribution: z.number().optional(),
});

// Export the schema for reuse in other parts of the application
export default goalDTOSchema;
