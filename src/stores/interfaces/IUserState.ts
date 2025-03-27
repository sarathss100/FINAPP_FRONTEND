import IUser from './IUser';

interface IUserState {
    user: IUser | null;
    login: (userData: IUser) => void;
    logout: () => void;
}

export default IUserState;

