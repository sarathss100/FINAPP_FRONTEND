import axiosInstance from "./axiosInstance";

// Marks a notification as seen by sending a POST request to the server.
export const markNotificationReaded = async function (notificationId: string): Promise<void> {
    try {
        // Send a POST request to mark a notification as seen
        await axiosInstance.patch(`notification/seen/${notificationId}`);
    
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

// Marks all notifications as seen by sending a PATCH request to the server.
export const markAllNotificationsAsSeen = async function (): Promise<void> {
    try {
        // Send a PATCH request to mark all notifications as seen
        await axiosInstance.patch(`notification/seen/all`);
    
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};