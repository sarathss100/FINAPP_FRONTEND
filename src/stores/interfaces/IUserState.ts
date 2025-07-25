import IUser from './IUser';

interface IUserState {
    user: IUser | null;
    isSubscribed: boolean | null,
    profilePicture: {
        image: string,
        contentType: string,
        extention: string,
    };
    login: (userData: IUser) => void;
    initializeSockets: () => void;
    fetchProfilePictureUrl: () => void;
    fetchSubscriptionStatus: () => void;
    logout: () => void;
    reset: () => void;
}

export default IUserState;

