import ISigninResponse, { ICanSignupResponse } from '@/types/ISigninResponse';
import axiosInstance from './axiosInstance';
import ISignupRequest from '@/types/ISignupRequest';
import IVerifyTokenResponse from '@/types/IVerifyTokenResponse';

// Create an Account
export const signUp = async function (formData: ISignupRequest | null): Promise<ISigninResponse> {
    try {
        const response = await axiosInstance.post<ISigninResponse>(`auth/signup`, formData);
        
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
        const response = await axiosInstance.post<ISigninResponse>(`auth/signin`, data);
        
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
        const response = await axiosInstance.post(`auth/verifications/phonenumber`, { phoneNumber });
        return response.status === 200 ? true : false;
    } catch (error) {
        throw error;
    }
}

// Verify the Account Exists for signup
export const checkSignupVerification = async function (phoneNumber: string): Promise<ICanSignupResponse> {
    try {
        const response = await axiosInstance.post<ICanSignupResponse>(`auth/verifications/signup`, { phoneNumber });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Verify the Account Exists
export const verifyToken = async function (token: string): Promise<IVerifyTokenResponse> {
    try {
        const response = await axiosInstance.post<IVerifyTokenResponse>(`auth/verifications/token`, { token }, {
            headers: {
                Cookie: `{"accessToken":"${token}"}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


// Signout User
export const signout = async function (): Promise<number> {
    try {
        const response = await axiosInstance.post(`auth/signout`);
        return response.status;
    } catch (error) {
        throw error;
    }
};

// Reset the Password
export const resetPassword = async function (phone_number: string, password: string): Promise<boolean> {
    try {
        const response = await axiosInstance.post('auth/password', { phone_number, password });
        return response.status === 200  ? true : false;
    } catch (error) {
        throw error;
    }
};
