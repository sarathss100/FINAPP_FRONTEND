interface ISigninResponse {
  success: string,
  message: string,
  data: {
    userId: string,
    role: string,
  }
}

export default ISigninResponse;
