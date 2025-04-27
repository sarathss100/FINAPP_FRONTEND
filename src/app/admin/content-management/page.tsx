import { AdminSideBar } from '@/components/admin/base/AdminSideBar';
import ContentManagementBody from '@/components/admin/content-management/ContentManagementBody';

const ContentManagement = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <ContentManagementBody />
                </div>
            </main>
        </div>
    )
};

export default ContentManagement;
