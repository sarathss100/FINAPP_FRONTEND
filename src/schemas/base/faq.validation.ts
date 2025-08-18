import { z } from 'zod';

// Define the Zod Schema for IFaq
const faqSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 charcters.").max(255),
    answer: z.string().min(10, "Answer must be at least 10 characters.").max(1000),
    isDeleted: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

// Export the schema for reuse in other parts of the application
export default faqSchema;
