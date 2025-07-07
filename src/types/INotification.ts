export const NOTIFICATION_TYPES = [
    'DebtPaymentAlert',
    'GoalPaymentAlert',
    'InsurancePaymentAlert',
    'ChatMessage',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export interface INotification {
    _id: string;
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    meta?: string | object;
    archived: boolean;
    createdAt: Date;
}


