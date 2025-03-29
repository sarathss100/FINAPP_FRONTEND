// Define the expected response structure
interface IVerifyTokenResponse {
    data: {
        decodedData: {
            userId?: string,
            phoneNumber?: string,
            status?: string,
            role?: string,
            newAccessToken?: string;
        };
    };
}

export default IVerifyTokenResponse;


