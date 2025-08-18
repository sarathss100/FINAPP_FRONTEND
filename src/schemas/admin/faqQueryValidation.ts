import { z } from 'zod';

const faqQuerySchema = z.object({
    page: z 
        .string()
        .optional()
        .default('1')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 1, {
            message: 'Pagination must be a positive integer',
        }),
    limit: z    
        .string()
        .optional()
        .default('10')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 1, {
            message: 'Limit must be a positive integer',
        }),
    search: z.string().optional().default('')
});

export default faqQuerySchema;