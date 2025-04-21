
export interface IGoal {
    user_id: string;
    tenant_id: string;
    goal_name: string;
    goal_category: string;
    target_amount: number;
    initial_investment: number;
    currency: string;
    target_date: Date;
    contribution_frequency: string;
    priority_level: string;
    description: string;
    reminder_frequency: string;
    goal_type: string;
    tags: string;
    dependencies: string;
    is_completed: boolean;
    created_by: string;
    last_updated_by: string;
}

export interface IGoalDetails {
    success: boolean,
    message: string,
    data: IGoal;
}
