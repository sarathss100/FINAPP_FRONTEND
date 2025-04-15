interface IDeleteAccount {
    success: string;
    message: string;
    data: {
        isDeleted: boolean;
    }
}

export default IDeleteAccount;
