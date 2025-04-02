
interface ISignupRequest {
    first_name: string,
    last_name: string,
    phone_number: string,
    password: string,
    confirm_password: string,
    terms: boolean,
}

export default ISignupRequest;
