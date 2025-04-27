import { AdminSideBar } from '@/components/admin/base/AdminSideBar';
import AdminSystemSettingsBody from '@/components/admin/system-settings/AdminSystemSettingsBody';

const SystemSettings = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <AdminSystemSettingsBody />
                </div>
            </main>
        </div>
    )
};

export default SystemSettings;
