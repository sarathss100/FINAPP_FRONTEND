
interface IPhoneNumberVerificationModalProps {
  onClose: () => void;
  onSuccess: (phone: string) => void;
  onFailure: (message: string) => void;
  isLoading: boolean;
}

export default IPhoneNumberVerificationModalProps;
