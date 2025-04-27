import AdminAnalyticsBody from '@/components/admin/analytics-reports/AdminAnalyticsBody';
import { AdminSideBar } from '@/components/admin/base/AdminSideBar';

const AnalyticsAndReports = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <AdminAnalyticsBody />
                </div>
            </main>
        </div>
    )
};

export default AnalyticsAndReports;
