import { z } from 'zod';

export const chatDTOSchema = z.object({
    _id: z.string().optional(),
    userId: z.string().min(1, { message: 'User ID is required' }).optional(),
    role: z.union(
        [z.literal('user'), z.literal('bot'), z.literal('admin')],
        { message: "Role must be either 'user' or 'bot'" }
    ).optional(),
    message: z.string().min(1, { message: 'Message content is required' }).optional(),
    timestamp: z.string()
        .refine(dateStr => {
            const date = new Date(dateStr);
            return !isNaN(date.getTime());
        }, {
            message: 'Invalid timestamp format',
        })
        .transform(dateStr => new Date(dateStr)).optional(),
});

