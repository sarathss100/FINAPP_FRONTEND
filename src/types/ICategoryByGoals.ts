
interface ICategoryByGoals {
    message: string;
    success: string;
    data: {
        goalsByCategory: {
            shortTermGoalsCurrntAmount: number; 
            shortTermGoalsTargetAmount: number; 
            mediumTermGoalsCurrntAmount: number; 
            mediumTermGoalsTargetAmount: number; 
            longTermGoalsCurrntAmount: number; 
            longTermGoalsTargetAmount: number; 
        }
    }
}

export default ICategoryByGoals;
