import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
// import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { getUserProfilePicture, getUserProfilePictureId } from '@/service/userService';
import useDebtStore from './debt/debtStore';
import useFaqStore from './faqs/faqStore';
import useTransactionStore from './transaction/transactionStore';
import useInvestmentStore from './investment/investmentStore';
import { useNotificationStore } from './notifications/notificationStore';
import { useInsuranceStore } from './insurances/insuranceStore';
import { useAccountsStore } from './accounts/accountsStore';
import { useGoalStore } from './goals/goalStore';
import IUser from './interfaces/IUser';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            profilePicture: {
                image: '',
                contentType: '',
                extention: '',
            },
            
            login: (userData: IUser) => {
                set(() => ({ user: { ...userData } }));
            },

            initializeSockets: () => {
                useAccountsStore.getState().initializeSocket();
                useNotificationStore.getState().initializeSocket();
                useGoalStore.getState().initializeSocket();
            },
            
            // fetchtheProfileUrl
            fetchProfilePictureUrl: async () => {
              try {         
                  const response = await getUserProfilePictureId();
                  const data = await response.data;
                  const imageData = await getUserProfilePicture(data.profilePictureUrl);
                  set({ profilePicture: imageData.data });
              } catch (error) {
                  console.error(`Failed to fetch Profile Picture Url:`, error);
                  set({ profilePicture: {
                        image: '',
                        contentType: '',
                        extention: '',
                }});
              }
            }, 

            reset: () => {
                // Clear the user state
                set(() => ({ user: null }));
                set(() => ({ profilePicture: {
                    image: '',
                    contentType: '',
                    extention: '',
                }}));
            },

            logout: () => {
                // Disconnect the account socket
                useAccountsStore.getState().disconnectSocket();
                useAccountsStore.getState().reset();

                // Disconnect the notification socket
                useNotificationStore.getState().disconnectSocket();
                useNotificationStore.getState().clearMessages();

                // Disconnect the goals socket
                useGoalStore.getState().disconnectSocket();
                useGoalStore.getState().reset();

                // Reset the transaction store
                useTransactionStore.getState().reset();

                // Reset the insurance store 
                useInsuranceStore.getState().reset();

                // Reset the debt store 
                useDebtStore.getState().reset();

                // Reset the faq store 
                useFaqStore.getState().reset();

                // Reset the investment store 
                useInvestmentStore.getState().reset();

                // Reset the user store
                useUserStore.getState().reset();
                
                // Clear the persisted storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('goal-storage');
                    localStorage.removeItem('user-storage');
                    localStorage.removeItem('transactions-storage');
                    localStorage.removeItem('accounts-storage');
                    localStorage.removeItem('insurances-storage');
                    localStorage.removeItem('faqs-storage');
                    localStorage.removeItem('investments-storage');
                    localStorage.removeItem('debts-storage');
                }
            }
        }),
        {
            name: 'user-storage'
        }
    )
);