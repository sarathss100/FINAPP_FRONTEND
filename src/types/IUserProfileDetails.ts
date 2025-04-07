interface IUser {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profilePictureUrl: string;
    role?: string;
    status?: boolean;
    email?: string;
    lastPasswordChange?: Date;
    twoFactorEnabled?: boolean;
    connectedAccounts?: string[];
}
interface IUserProfileDetails {
    success: boolean,
    message: string,
    data: IUser;
}

export default IUserProfileDetails;
