interface ISigninResponse {
  success: string,
  message: string,
  data: {
    userId: string,
    role: string,
    is2FA?: boolean,
    phoneNumber?: string,
  }
}

export default ISigninResponse;
