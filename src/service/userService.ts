import IUserProfileDetails, { IToken } from '@/types/IUserProfileDetails';
import axiosInstance from './axiosInstance';
import IUserProfilePictureUrl, { IUserProfilePicture } from '@/types/IUserProfilePictureUrl';
import IToggle2FA from '@/types/IToggle2FA';
import IDeleteAccount from '@/types/IDeleteAccount';

// Fetches detailed profile information for a user from the backend API
export const getUserProfileDetails = async function (): Promise<IUserProfileDetails> {
    try {
        // Send a GET request to fetch user profile details
        const response = await axiosInstance.get<IUserProfileDetails>('user/me');

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the user profile details if successfull.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to fetch user profile details.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Update profile picture url for a user from the backend API
export const updateUserProfilePicture = async function (formData: FormData): Promise<IUserProfilePictureUrl> {
    try {
        // Send a POST request to update user profile picture
        const response = await axiosInstance.post<IUserProfilePictureUrl>('user/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the user profile picture url if successfull.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to fetch user profile picture url.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Fetches profile picture url for a user from the backend API
export const getUserProfilePictureId = async function (): Promise<IUserProfilePictureUrl> {
    try {
        // Send a POST request to user profile picture url
        const response = await axiosInstance.get<IUserProfilePictureUrl>('user/me/avatar');
        
        // Validate the response 
        if (response.data && response.data.success) {
            return response.data; // Return the user profile picture url if successfull.
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to fetch user profile picture url.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};

// Fetches the user's profile picture information (containing the image URL) from the backend API
export const getUserProfilePicture = async function (imageId: string): Promise<IUserProfilePicture> {
    try {
        // Send a GET request to fetch profile picture metadata by ID
        const response = await axiosInstance.get<IUserProfilePicture>(`${imageId}`);
        
        // Validate the response structure and success flag
        if (response.data && response.data.success) {
            return response.data; // Return the profile picture metadata (including URL) on success
        } else {
            // Handle explicit error response from API
            throw new Error(response.data?.message || `Failed to fetch profile picture data`);
        }
    } catch (error) {
        // Propagate network errors or unexpected failures to the caller
        throw error;
    }
};

// Toggles the Two-Factor Authentication (2FA) status for a user via the backend API
export const toggleUserTwoFactorAuthentication = async function (): Promise<IToggle2FA> {
    try {
        // Send a POST request to toggle the 2FA status
        const response = await axiosInstance.patch<IToggle2FA>(`user/two-factor`);

        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the response data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || `Failed to toggle Two Factor Authentication.`);
        }
    } catch (error) {
        // Re-throw the error for upstream handling
        throw error;
    }
};


// Toggles the Two-Factor Authentication (2FA) status for a user via the backend API
export const deleteAccount = async function (): Promise<IDeleteAccount> {
    try {
        // The endpoint `/api/v1/user/profile/delete` is responsible for handling account deletion
        const response = await axiosInstance.delete<IDeleteAccount>(`user/me`);

        // Check if the response contains data and if the `success` flag is set to true
        if (response.data && response.data.success) {
            // This typically includes confirmation or additional details about the deletion process
            return response.data;
        } else {
            // Use the `message` field from the response if available, or provide a default error message
            throw new Error(response.data?.message || `Failed to delete Account.`);
        }
    } catch (error) {
        // Re-throw the error to allow upstream error handling (e.g., in the UI layer)
        throw error;
    }
};

// Toggles the Two-Factor Authentication (2FA) status for a user via the backend API
export const getToken = async function (): Promise<IToken> {
    try {
        // The endpoint `/api/v1/user/profile/delete` is responsible for handling account deletion
        const response = await axiosInstance.get<IToken>(`chat/token`);

        // Check if the response contains data and if the `success` flag is set to true
        if (response.data && response.data.success) {
            // This typically includes confirmation or additional details about the deletion process
            return response.data;
        } else {
            // Use the `message` field from the response if available, or provide a default error message
            throw new Error(response.data?.message || `Failed to delete Account.`);
        }
    } catch (error) {
        // Re-throw the error to allow upstream error handling (e.g., in the UI layer)
        throw error;
    }
};