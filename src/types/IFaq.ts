export interface IFaq {
    _id?: string,
    question: string;
    answer: string;
    isDeleted?: boolean;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFaqs {
    success: boolean,
    message: string,
    data: {
        faqDetails: IFaq[]
    };
}

export interface IFaqsDetails {
    success: boolean,
    message: string,
    data: {
        isAdded: boolean; 
    };
}

export interface IRemoveFaqDetails {
    success: boolean,
    message: string,
    data: {
        isRemoved: boolean; 
    };
}

export interface ITogglePublishDetails {
    success: boolean,
    message: string,
    data: {
        isToggled: boolean; 
    };
}

export interface IUpdateFaqDetails {
    success: boolean,
    message: string,
    data: {
        isUpdated: boolean; 
    };
}


