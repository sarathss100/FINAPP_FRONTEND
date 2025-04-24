"use client";
import { AdminSideBar } from '@/components/admin/base/AdminSideBar';
import AdminDashBoardBody from '@/components/admin/dashboard/AdminDashboardBody';

const AdminDashboard = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <AdminDashBoardBody />
                </div>
            </main>
        </div>
    )
};

export default AdminDashboard;
