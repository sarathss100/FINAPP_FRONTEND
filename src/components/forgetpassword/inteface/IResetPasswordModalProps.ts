
interface IResetPasswordModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
  isLoading: boolean;
  phoneNumber: string;
}

export default IResetPasswordModalProps;
