import axiosInstance from "./axiosInstance";

/**
 * Marks a notification as seen by sending a POST request to the server.
 *
 * @param {string} notificationId - The ID of the notification to mark as seen.
 * @returns {Promise<void>} A promise that resolves when the notification is successfully marked.
 * @throws {Error} If the API call fails, an error is thrown.
 */
export const markNotificationReaded = async function (notificationId: string): Promise<void> {
    try {
        // Send a POST request to mark a notification as seen
        await axiosInstance.patch(`/api/v1/notification/seen/${notificationId}`);
    
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};

/**
 * Marks all notifications as seen by sending a PATCH request to the server.
 *
 * @returns {Promise<void>} A promise that resolves when all notifications are successfully marked as seen.
 * @throws {Error} If the API call fails, an error is thrown.
 */
export const markAllNotificationsAsSeen = async function (): Promise<void> {
    try {
        // Send a PATCH request to mark all notifications as seen
        await axiosInstance.patch(`/api/v1/notification/seen/all`);
    
    } catch (error) {
        // Catch and re-throw any error that occurs during the API call
        throw error;
    }
};