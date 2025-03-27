import { ConfirmationResult } from 'firebase/auth';
import { SignupFormValues } from '../lib/validationSchemas';

interface IOtpVerificationModalProps {
  phoneNumber: string;
  onClose: () => void;
  confirmationResult: ConfirmationResult | null;
  formData: SignupFormValues | null;
}

export default IOtpVerificationModalProps;
