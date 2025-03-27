import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            login: (userData: IUser) => set(() => ({ user: { ...userData, isLoggedIn: true } })),
            logout: () => set(() => ({ user: null }))
        }),
        {
            name: 'user-storage'
        }
    )
);


