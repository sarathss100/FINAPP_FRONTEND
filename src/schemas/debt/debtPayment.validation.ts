import { z } from 'zod';

// Define the Zod Schema for Debt Payments DTO
const debtPaymentDTOSchema = z.object({
    _id: z.string().optional(),
    debtId: z.string({ required_error: 'Debt ID is required' }),
    amountPaid: z.number()
        .min(0.01, 'Amount paid must be greater than zero'),
    principalAmount: z.number()
        .min(0, 'Principal amount cannot be negative'),
    interestAmount: z.number()
        .min(0, 'Interest amount cannot be negative'),
    paymentDate: z.date().optional().default(new Date()),
    isLate: z.boolean().default(false)
});

// Export the schema for reuse in other parts of the application
export default debtPaymentDTOSchema;
