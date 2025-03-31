
import { AdminSideBar } from '@/components/adminsidebar/AdminSideBar';

const AnalyticsAndReports = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
                <div className='p-6'>
                  <h1 className='text-2xl font-bold'>AnalyticsAndReports</h1>
                  <p>For Test Purpose</p>
                </div>
            </main>
        </div>
    )
};

export default AnalyticsAndReports;
