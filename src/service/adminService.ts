import IAdminUserDetails, { INewRegistrationCount, ISystemHealthStatus, ISystemMetrics } from '@/types/IAdminUserDetails';
import axiosInstance from './axiosInstance';

// Get all users
export const getAllUsers = async function (): Promise<IAdminUserDetails> {
    try {
        const response = await axiosInstance.get<IAdminUserDetails>('/api/v1/admin/users');
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || `Failed to fetch user details.`);
        }
    } catch (error) {
        throw error;
    }
};

// Block/Unblock User 
export const toggleUserStats = async function (userId: string, status: boolean) {
    try {
        const response = await axiosInstance.post(`/api/v1/admin/users/status`, { userId, status });
        if (response.status !== 200) throw new Error(`Failed toggle user status.`);
    } catch (error) {
        throw error;
    }
}

// get New Registration Count 
export const getNewRegistrationCount = async function (): Promise<INewRegistrationCount> {
    try {
        const response = await axiosInstance.get<INewRegistrationCount>(`/api/v1/admin/analytics/registrations`);
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || `Failed to fetch user details.`);
        }
    } catch (error) {
        throw error;
    }
}

// get System Health Status 
export const getSystemHealthStatus = async function (): Promise<ISystemHealthStatus> {
    try {
        const response = await axiosInstance.get<ISystemHealthStatus>(`/api/v1/admin/health`);
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || `Failed to fetch system health details.`);
        }
    } catch (error) {
        throw error;
    }
}

// get System Metrics 
export const getSystemMetrics = async function (): Promise<ISystemMetrics> {
    try {
        const response = await axiosInstance.get<ISystemMetrics>(`/api/v1/admin/metrics`);
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || `Failed to fetch system metrics details.`);
        }
    } catch (error) {
        throw error;
    }
}
