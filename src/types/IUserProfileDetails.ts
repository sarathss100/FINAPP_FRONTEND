interface IUser {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profilePictureUrl: string;
    is2FA: boolean;
    role?: string;
    status?: boolean;
    subscription_status?: boolean;
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


export interface IToken {
    success: boolean,
    message: string,
    data: { accessToken: string };
}
