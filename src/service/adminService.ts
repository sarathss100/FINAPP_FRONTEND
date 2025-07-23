import IAdminUserDetails, { INewRegistrationCount, ISystemHealthStatus, ISystemMetrics } from '@/types/IAdminUserDetails';
import axiosInstance from './axiosInstance';
import { IFaq, IFaqs, IFaqsDetails, IRemoveFaqDetails, ITogglePublishDetails, IUpdateFaqDetails } from '@/types/IFaq';

// Get all users
export const getAllUsers = async function (): Promise<IAdminUserDetails> {
    try {
        const response = await axiosInstance.get<IAdminUserDetails>('admin/users');
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
        const response = await axiosInstance.post(`admin/users/status`, { userId, status });
        if (response.status !== 200) throw new Error(`Failed toggle user status.`);
    } catch (error) {
        throw error;
    }
}

// get New Registration Count 
export const getNewRegistrationCount = async function (): Promise<INewRegistrationCount> {
    try {
        const response = await axiosInstance.get<INewRegistrationCount>(`admin/analytics/registrations`);
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
        const response = await axiosInstance.get<ISystemHealthStatus>(`admin/health`);
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
        const response = await axiosInstance.get<ISystemMetrics>(`admin/metrics`);
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || `Failed to fetch system metrics details.`);
        }
    } catch (error) {
        throw error;
    }
}

// Creates a new FAQ entry by sending a POST request to the backend API.
export const addFaq = async function (formData: IFaq): Promise<IFaqsDetails> {
    try {
        // Send a POST request to create FAQ
        const response = await axiosInstance.post<IFaqsDetails>(`admin/faqs`, { ...formData });
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the data if successful
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to create FAQ.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Deletes an existing FAQ entry by its ID via a DELETE request to the backend API.
export const removeFaq = async function (faqId: string): Promise<IRemoveFaqDetails> {
    try {
        // Send a DELETE request to remove the FAQ
        const response = await axiosInstance.delete<IRemoveFaqDetails>(`/admin/faq/${faqId}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the server response
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to delete FAQ.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Toggles the publish status (e.g., 'isPublished') of an FAQ entry by its ID via a PATCH request to the backend API.
export const togglePublish = async function (faqId: string): Promise<ITogglePublishDetails> {
    try {
        // Send a PATCH request to toggle the publish status
        const response = await axiosInstance.patch<ITogglePublishDetails>(`/admin/faq/${faqId}`);
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the server response
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to toggle publish status.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Updates an existing FAQ entry with the provided data via a PUT request to the backend API.
export const updateFaq = async function (faqId: string, formData: IFaq): Promise<IUpdateFaqDetails> {
    try {
        console.log(faqId, formData)
        // Send a PUT request to update the FAQ
        const response = await axiosInstance.put<IUpdateFaqDetails>(`/admin/faq/${faqId}`, { ...formData });
    
        // Validate the response
        if (response.data && response.data.success) {
            return response.data; // Return the updated FAQ from the server
        } else {
            // Throw an error if the response indicates failure
            throw new Error(response.data?.message || 'Failed to update FAQ.');
        }
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

export const getAllFaqsForAdmin = async function (params: { page?: number, limit?: number, search?: string } = {}): Promise<IFaqs> {
    try {
        const response = await axiosInstance.get<IFaqs>(`/admin/faqs/all`, { params });
    
        if (response.data && response.data.success) {
            return response.data; 
        } else {
            throw new Error(response.data?.message || 'Failed to fetch FAQs.');
        }
    } catch (error) {
        throw error;
    }
};
