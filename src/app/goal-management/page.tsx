import { UserSideBar } from '@/components/user/base/UserSideBar';
import { GoalManagementBody } from '@/components/user/goal-management/GoalManagementBody';

const GoalManagement = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
                <div className='p-6'>
                  <GoalManagementBody />
                </div>
            </main>
        </div>
    )
}

export default GoalManagement;
