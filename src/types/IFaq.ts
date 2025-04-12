export interface IFaq {
    question: string;
    answer: string;
}

export interface IFaqs {
    success: boolean,
    message: string,
    data: {
        faqDetails: IFaq[]
    };
}


