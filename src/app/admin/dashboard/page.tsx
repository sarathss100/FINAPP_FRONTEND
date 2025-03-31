"use client";

import { AdminSideBar } from '@/components/adminsidebar/AdminSideBar';

const AdminDashboard = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
                <div className='p-6'>
                  <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
                  <p>For Test Purpose</p>
                </div>
            </main>
        </div>
    )
};

export default AdminDashboard;
