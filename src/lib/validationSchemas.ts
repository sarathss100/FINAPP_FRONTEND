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
