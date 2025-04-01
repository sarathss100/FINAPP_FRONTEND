
import { UserManagementBody } from '@/components/admin/user-management/UserManagementBody';
import { AdminSideBar } from '@/components/adminsidebar/AdminSideBar';

const UserManagement = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
                <div className='p-6'>
                  <UserManagementBody />
                </div>
            </main>
        </div>
    )
};

export default UserManagement;
