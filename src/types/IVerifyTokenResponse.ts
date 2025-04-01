// Define the expected response structure
interface IVerifyTokenResponse {
    data: {
        userId?: string,
        phoneNumber?: string,
        status?: boolean,
        role?: string,
        newAccessToken?: string;
    };
}

export default IVerifyTokenResponse;


