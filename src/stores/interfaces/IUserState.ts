import IUser from './IUser';

interface IUserState {
    user: IUser | null;
    profilePicture: {
        image: string,
        contentType: string,
        extention: string,
    };
    login: (userData: IUser) => void;
    fetchProfilePictureUrl: () => void;
    logout: () => void;
    reset: () => void;
}

export default IUserState;

