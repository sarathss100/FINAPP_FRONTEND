export interface ISubscription {
    _id?: string;
    user_id: string;
    plan_name: string;
    plan_type: 'monthly' | 'annually';
    payment_date: Date;
    expiry_date: Date;
    amount: number;
    currency: 'INR';
    subscription_mode: 'auto_renewal' | 'manual';
    status: "active" | "expired" | 'cancelled';
    payment_method: string;
    transaction_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICheckout {
    amount: number,
    currency: 'INR',
    plan: 'monthly',
}

export interface InitiatePayment {
    success: boolean,
    message: string,
    data: {
        checkoutUrl: string;
    }
}

export interface SubscriptionStatus {
    success: boolean,
    message: string,
    data: {
        subscription_status: boolean;
    }
}

export interface SubscriptionDetails {
    success: boolean,
    message: string,
    data: {
        subscriptionPlanDetails: ISubscription;
    }
}

