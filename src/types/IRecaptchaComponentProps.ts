import { RecaptchaVerifier } from 'firebase/auth'

interface IRecaptchaComponentProps {
    onRecaptchaInit: (verifier: RecaptchaVerifier) => void;
}

export default IRecaptchaComponentProps;
