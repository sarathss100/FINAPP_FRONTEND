import { create } from 'zustand';
import IUserState from './interfaces/IUserState';
// import IUser from './interfaces/IUser';
import { persist } from 'zustand/middleware';
import { getUserProfileDetails, getUserProfilePicture, getUserProfilePictureId } from '@/service/userService';
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
            isSubscribed: null,
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
                useDebtStore.getState().initializeSocket();
                useInsuranceStore.getState().initializeSocket();
                useInvestmentStore.getState().initializeSocket();
                useTransactionStore.getState().initializeSocket();
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

            // fetchtheSubscriptionStatus
            fetchSubscriptionStatus: async () => {
              try {         
                  const response = await getUserProfileDetails();
                  const data = await response.data;
                  const isSubscribed = data.subscription_status
                  set({ isSubscribed });
              } catch (error) {
                  console.error(`Failed to fetch Subscription status:`, error);
                  set({ isSubscribed: null });
              }
            }, 

            reset: () => {
                // Clear the user state
                set(() => ({ user: null }));
                set(() => ({ isSubscribed: null}));
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

                // Disconnect the debts socket
                useDebtStore.getState().disconnectSocket();
                useDebtStore.getState().reset();

                // Disconnect the insurances socket
                useInsuranceStore.getState().disconnectSocket();
                useInsuranceStore.getState().reset();

                // Disconnect the investments socket
                useInvestmentStore.getState().disconnectSocket();
                useInvestmentStore.getState().reset();

                // Disconnect the transaction socket
                useTransactionStore.getState().disconnectSocket();
                useTransactionStore.getState().reset();

                // Reset the faq store 
                useFaqStore.getState().reset();

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