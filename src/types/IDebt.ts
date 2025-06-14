export interface IDebt {
    _id?: string,
    userId?: string;
    accountId?: string | null;
    debtName: string;
    initialAmount: number;
    currency: string;
    interestRate: number;
    interestType: string;
    tenureMonths: number;
    monthlyPayment?: number;
    startDate?: Date;
    nextDueDate?: Date;
    endDate?: Date;
    status?: string;
    currentBalance?: number;
    totalInterestPaid?: number;
    totalPrincipalPaid?: number;
    additionalCharges: number;
    notes: string;
    isDeleted?: boolean;
    isGoodDebt?: boolean;
}

export interface IDebtDetails {
    success: boolean,
    message: string,
    data: {
        debt: IDebt;
    }
}

export interface ITotalOutstandingAmountDetails {
    success: boolean,
    message: string,
    data: {
        totalOutstandingDebt: number;
    }
}

export interface ITotalMonthlyPaymentDetails {
    success: boolean,
    message: string,
    data: {
        totalMonthlyPayment: number;
    }
}

export interface ITotalDebtDetails {
    success: boolean,
    message: string,
    data: {
        totalDebt: number;
    }
}

export interface ILongestTenureDetails {
    success: boolean,
    message: string,
    data: {
        maxTenure: number;
    }
}

export interface IDebtCategoryDetails {
    success: boolean,
    message: string,
    data: {
        debtDetails: IDebt[];
    }
}

export interface SimulationResult {
    totalMonths: number;
    totalInterestPaid: number;
    totalMonthlyPayment: number;
}
  
export interface ComparisonResult {
    snowball: SimulationResult;
    avalanche: SimulationResult;
}

export interface IRepaymentSimulationDetails {
    success: boolean,
    message: string,
    data: {
        repaymentComparisonResult: ComparisonResult;
    }
}
