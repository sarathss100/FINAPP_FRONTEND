import { z } from 'zod';

// Define the Signin validation schema 
export const SigninSchema = z.object({
    phone_number: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});


