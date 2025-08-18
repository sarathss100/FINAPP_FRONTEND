import { z } from 'zod';

export const insuranceDTOSchema = z.object({
    _id: z.string().optional(),
    userId: z.string().optional(),
    type: z.string().min(1, { message: 'Type is required' }),
    coverage: z.number().positive({ message: 'Coverage must be a positive number' }),
    premium: z.number().positive({ message: 'Premium must be a positive number' }),
    next_payment_date: z.string()
        .refine(dateStr => {
            const date = new Date(dateStr);
            return !isNaN(date.getTime());
        }, {
            message: 'Invalid date value',
        })
        .transform(dateStr => new Date(dateStr)),
    payment_status: z.string().min(1, { message: `Payment Status is Required` }),
    status: z.string().min(1, { message: 'Status is required' }).optional(),
});

export const initiatePaymentDTOSchema = z.object({
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
    currency: z.literal('INR').default('INR'), 
    plan: z.enum(['monthly']).default('monthly'),
});

