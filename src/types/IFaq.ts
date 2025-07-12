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
        faqDetails: IFaq[],
        pagination: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
            itemsPerPage: number,
            hasNextPage: boolean,
            hasPreviousPage: boolean,
        }
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


