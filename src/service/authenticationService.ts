import ISigninResponse from '@/types/ISigninResponse';
import axiosInstance from './axiosInstance';
import ISignupRequest from '@/types/ISignupRequest';

// Create an Account
export const signUp = async function (formData: ISignupRequest | null): Promise<ISigninResponse> {
    try {
        const response = await axiosInstance.post<ISigninResponse>(`api/v1/auth/signup`, formData);
        
        // Validate response data
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.message || `Invalid respone from server`);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

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

// Verify the Account Exists
export const verifyPhoneNumber = async function (phoneNumber: string): Promise<boolean> {
    try {
        const response = await axiosInstance.post(`api/v1/auth/verify-phonenumber`, { phoneNumber });
        return response.status === 200 ? true : false;
    } catch (error) {
        throw error;
    }
}

// Signout User
export const signout = async function (): Promise<number> {
    try {
        const response = await axiosInstance.post(`api/v1/auth/signout`);
        return response.status;
        
    } catch (error) {
        throw error;
    }
};
