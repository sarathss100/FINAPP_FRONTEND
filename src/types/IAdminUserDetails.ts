
interface IAdminUserDetails {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    email?: string;
    lastPasswordChange?: Date;
    twoFactorEnabled?: boolean;
    connectedAccounts?: string[];
}

export default IAdminUserDetails;
