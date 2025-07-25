
export interface IGoal {
    _id: string;
    user_id: string;
    tenant_id: string;
    goal_name: string;
    goal_category: string;
    target_amount: number;
    initial_investment: number;
    current_amount: number;
    currency: string;
    target_date: Date;
    contribution_frequency: string;
    priority_level: string;
    description: string;
    reminder_frequency: string;
    goal_type: string;
    tags: string[];
    dependencies: string[]
    is_completed: boolean;
    created_by: string;
    last_updated_by: string;
    timeframe: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt?: Date | string;
    dailyContribution?: number;
    monthlyContribution?: number;
}

export interface IGoalDetails {
    success: boolean,
    message: string,
    data: IGoal[];
}

export interface ITotalActiveGoalAmount {
    success: boolean,
    message: string,
    data: { totalActiveGoalAmount: number };
}

export interface ITotalInitialGoalAmount {
    success: boolean,
    message: string,
    data: { totalInitialGoalAmount: number };
}

export interface ILongestTimePeriod {
    success: boolean,
    message: string,
    data: { longestTimePeriod: string };
}

export interface IGoalDeleted {
    success: boolean,
    message: string,
    data: { isDeleted: boolean };
}

export interface IGoalDailyContributionAmount {
    success: boolean,
    message: string,
    data: { dailyContribution: number };
}

export interface IGoalMonthlyContributionAmount {
    success: boolean,
    message: string,
    data: { monthlyContribution: number };
}

export interface IGoalDetail {
    success: boolean,
    message: string,
    data: { goalDetails: IGoal };
}

export interface IGoalTransaction {
    success: boolean,
    message: string,
    data: { isUpdated: boolean };
}
