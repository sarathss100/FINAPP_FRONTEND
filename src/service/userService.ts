import IUserProfileDetails from '@/types/IUserProfileDetails';
import axiosInstance from './axiosInstance';
import IUserProfilePictureUrl from '@/types/IUserProfilePictureUrl';

// Fetches detailed profile information for a user from the backend API
export const getUserProfileDetails = async function (): Promise<IUserProfileDetails> {
    try {
        // Send a GET request to fetch user profile details
        const response = await axiosInstance.get<IUserProfileDetails>('/api/v1/user/profile');

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
        const response = await axiosInstance.post<IUserProfilePictureUrl>('/api/v1/user/profile/profile-picture', formData, {
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
export const getUserProfilePictureUrl = async function (): Promise<IUserProfilePictureUrl> {
    try {
        // Send a POST request to user profile picture url
        const response = await axiosInstance.get<IUserProfilePictureUrl>('/api/v1/user/profile/profile-picture');
        console.log(`Fetched Data in Service:`, response.data);
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
