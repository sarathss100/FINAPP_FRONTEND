import IUserProfileDetails from '@/types/IUserProfileDetails';
import axiosInstance from './axiosInstance';

// Get all users
export const getUserProfileDetails = async function (): Promise<IUserProfileDetails> {
    try {
        const response = await axiosInstance.get<IUserProfileDetails>('/api/v1/user/profile');
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || `Failed to fetch user profile details.`);
        }
    } catch (error) {
        throw error;
    }
};
