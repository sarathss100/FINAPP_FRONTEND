export interface Insurance {
    _id?: string,
    userId?: string;
    type: string;
    coverage: number;
    premium: number;
    next_payment_date: Date;
    payment_status: string;
    status?: string;
}

export interface InsuranceCoverage {
    success: boolean,
    message: string,
    data: {
        totalInsuranceCoverage: number;
    }
}

export interface InsurancePremium {
    success: boolean,
    message: string,
    data: {
        totalPremium: number;
    }
}

export interface InsurancesDetails {
    success: boolean,
    message: string,
    data: {
        insuranceDetails: Insurance[];
    }
}

export interface InsuranceRemoved {
    success: boolean,
    message: string,
    data: {
        deleted: boolean;
    }
}

export interface InsuranceDetails {
    success: boolean,
    message: string,
    data: {
        insurance: Insurance;
    }
}

export interface paymentStatus {
    success: boolean,
    message: string,
    data: {
        isUpdated: boolean;
    }
}
