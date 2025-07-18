"use client";
import { UserSideBar } from '@/components/user/base/UserSideBar';
import UserDashBoardBody from '@/components/user/dashboard/UserDashBoardBody';
import { useUserStore } from '@/stores/store';
import { useEffect } from 'react';

const Dashboard = function () {
    const fetchSubscriptionStatus = useUserStore((state) => state.fetchSubscriptionStatus);
    useEffect(() => {
        // useUserStore.getState().initializeSockets();
        fetchSubscriptionStatus();
    }, [fetchSubscriptionStatus]);
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <UserDashBoardBody />
                </div>
            </main>
        </div>
    )
};

export default Dashboard;
