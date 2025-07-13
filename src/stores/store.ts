import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { getUserProfilePicture, getUserProfilePictureId } from '@/service/userService';
import useDebtStore from './debt/debtStore';
import useFaqStore from './faqs/faqStore';
import useTransactionStore from './transaction/transactionStore';
import useInvestmentStore from './investment/investmentStore';
import { useNotificationStore } from './notifications/notificationStore';
import { connectWebSocket, disconnectWebSocket } from '@/service/websocketService';
import { useInsuranceStore } from './insurances/insuranceStore';
import { useAccountsStore } from './accounts/accountsStore';
import { useGoalStore } from './goals/goalStore';

export const useUserStore = create<IUserState>()(
    persist(
        (set) => ({
            user: null,
            profilePicture: {
                image: '',
                contentType: '',
                extention: '',
            },
            login: async (userData: IUser) => {
                set(() => ({ user: { ...userData } }));
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

            initializeWebSocketConnection: async () => {
                await connectWebSocket();
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
                // Reset the goal store 
                useGoalStore.getState().reset();

                // Reset the user store
                useUserStore.getState().reset();

                // Reset the account store 
                useAccountsStore.getState().reset();

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

                // Disconnect the socket
                useNotificationStore.getState().disconnectSocket();
                useNotificationStore.getState().clearMessages();

                // Clear the persisted goal storage
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

                disconnectWebSocket();
            }
        }),
        {
            name: 'user-storage'
        }
    )
);