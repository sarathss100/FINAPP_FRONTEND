// Define the expected response structure
interface IVerifyTokenResponse {
    data: {
        userId?: string,
        phoneNumber?: string,
        status?: boolean,
        role?: string,
        subscription_status?: boolean,
        newAccessToken?: string;
    };
}

export default IVerifyTokenResponse;


