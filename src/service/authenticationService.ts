import ISigninResponse from '@/types/ISigninResponse';
import axiosInstance from './axiosInstance';

// Sign in User
export const signIn = async function (data: { phone_number: string, password: string }): Promise<ISigninResponse> {
    try {
        const response = await axiosInstance.post<ISigninResponse>(`api/v1/auth/signin`, data);
        
        // Validate response data
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.message || `Invalid respone from server`);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};
