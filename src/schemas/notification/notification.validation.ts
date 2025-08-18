import { NOTIFICATION_TYPES } from '../../model/notification/interfaces/INotificaiton';
import { z } from 'zod';

// Create a Zod enum schema from the array
const notificationTypeEnum = z.enum(NOTIFICATION_TYPES);

// Define the Zod schema to match the INotification interface
const notificationDTOSchema = z.object({
    user_id: z.string({ required_error: 'User ID is required' }).optional(),
    title: z.string({ required_error: 'Title is required' }),
    message: z.string({ required_error: 'Message is required' }),
    type: notificationTypeEnum,
    is_read: z.boolean().default(false),
    meta: z.union([z.string(), z.record(z.any())]).optional(),
    archived: z.boolean().default(false),
});

// Export both the type for reuse
export default notificationDTOSchema;