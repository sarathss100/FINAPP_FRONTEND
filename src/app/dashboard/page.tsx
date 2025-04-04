"use client";
import { UserSideBar } from '@/components/user/base/UserSideBar';

const Dashboard = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
                <div className='p-6'>
                  <h1 className='text-2xl font-bold'>User Dashboard</h1>
                  <p>For Test Purpose</p>
                </div>
            </main>
        </div>
    )
};

export default Dashboard;
