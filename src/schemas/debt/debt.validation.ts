import { z } from 'zod';

// Define the Zod Schema for Debt DTO
const debtDTOSchema = z.object({
    _id: z.string().optional(),
    userId: z.string().min(1, 'User ID is required').optional(),
    accountId: z.string().nullable().optional(),
    debtName: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    initialAmount: z.number()
        .min(0, 'Initial amount cannot be negative')
        .refine(val => val !== null && val !== undefined, {
            message: 'Initial amount is required'
        }),
    currency: z.string().default('INR'),
    interestRate: z.number().default(0),
    interestType: z.enum(['Flat', 'Diminishing']).default('Diminishing'),
    tenureMonths: z.number()
        .int()
        .min(1, 'Tenure must be at least 1 month')
        .refine(val => val !== null && val !== undefined, {
            message: 'Tenure in months is required'
        }),
    monthlyPayment: z.number()
        .min(0, 'Monthly payment cannot be negative')
        .refine(val => val !== null && val !== undefined, {
            message: 'Monthly payment is required'
        }).optional(),
    monthlyPrincipalPayment: z.number().default(0).optional(),
    montlyInterestPayment: z.number().default(0).optional(),
    startDate: z.coerce.date().optional().default(new Date()),
    nextDueDate: z.coerce.date().optional().default(() => {
        const now = new Date();
        return new Date(now.setMonth(now.getMonth() + 1));
    }),
    endDate: z.coerce.date().optional(),
    status: z.enum(['Active', 'Paid', 'Cancelled', 'Overdue']).default('Active'),
    currentBalance: z.number()
        .min(0, 'Current balance cannot be negative')
        .refine(val => val !== null && val !== undefined, {
            message: 'Current balance is required'
        }).optional(),
    totalInterestPaid: z.number().default(0),
    totalPrincipalPaid: z.number().default(0),
    additionalCharges: z.number().default(0),
    notes: z.string()
        .max(500, 'Notes cannot exceed 500 characters')
        .optional()
        .default(''),
    isDeleted: z.boolean().default(false),
    isGoodDebt: z.boolean().default(false),
    isCompleted: z.boolean().default(false),
    isExpired: z.boolean().default(false),
});

// Export the schema for reuse in other parts of the application
export default debtDTOSchema;
