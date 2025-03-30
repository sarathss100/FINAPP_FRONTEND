interface ISigninResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    role: string;
    accessToken: string;
  };
}

export default ISigninResponse;
