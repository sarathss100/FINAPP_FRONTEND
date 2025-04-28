import IUser from './IUser';

interface IUserState {
    user: IUser | null;
    profilePictureUrl: string;
    login: (userData: IUser) => void;
    fetchProfilePictureUrl: () => void;
    updateProfilePictureUrl: (url: string) => void;
    logout: () => void;
    reset: () => void;
}

export default IUserState;

