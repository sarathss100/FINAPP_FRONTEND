import { ConfirmationResult } from 'firebase/auth';

interface IResetPasswordOtpVerificationModalProps {
  onClose: () => void;
  onSuccess: (isOtpVerified: boolean) => void;
  onFailure: (message: string) => void;
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  isLoading: boolean;
}

export default IResetPasswordOtpVerificationModalProps;
