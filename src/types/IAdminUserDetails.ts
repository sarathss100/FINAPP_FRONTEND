
interface IUser {
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
interface IAdminUserDetails {
    success: boolean,
    message: string,
    data: IUser[];
}

export default IAdminUserDetails;

export interface INewRegistrationCount {
    success: boolean,
    message: string,
    data: {
        newRegistrationCount: number
    }
}

export interface IHealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    score?: number;
    details?: string;
    checks?: string[];
    lastChecked?: Date;
}

export interface ISystemHealthStatus {
    success: boolean,
    message: string,
    data: {
        healthStatus: IHealthStatus
    }
}

export interface SystemMetrics {
    ramUsage: number;
    diskUsage: number;
}

export interface ISystemMetrics {
    success: boolean,
    message: string,
    data: {
        usageStatics: SystemMetrics
    }
}
