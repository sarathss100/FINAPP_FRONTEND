import IAdminUserDetails from '@/types/IAdminUserDetails';
import axiosInstance from './axiosInstance';

// Get all users
export const getAllUsers = async function (): Promise<IAdminUserDetails> {
    try {
        const response = await axiosInstance.get<IAdminUserDetails>('/api/v1/admin/all-users');
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
        const response = await axiosInstance.post(`/api/v1/admin/toggle-user-status`, { userId, status });
        
        if (response.status !== 200) throw new Error(`Failed toggle user status.`);
    } catch (error) {
        throw error;
    }
}
