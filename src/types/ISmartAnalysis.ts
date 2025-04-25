
interface ISmartAnalysisResult {
    message: string;
    success: string;
    data: {
        isSmartCompliant: boolean;
        feedback: {
            Overall: string;
            [key: string]: string;
        };
        suggestions: string[];
        totalScore: number;
        criteriaScores: {
            specific: number;
            measurable: number;
            achievable: number;
            relevant: number;
            timeBound: number;
            [key: string]: number;
        };
    }
}

export default ISmartAnalysisResult;
