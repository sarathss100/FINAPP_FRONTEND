
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
