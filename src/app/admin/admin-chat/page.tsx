import AdminChatBody from "@/components/admin/admin-chat/AdminChatBody";
import { AdminSideBar } from "@/components/admin/base/AdminSideBar";

const AdminChatManagement = function () {
    return (
        <div className='flex h-screen'>
            <AdminSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <AdminChatBody />
                </div>
            </main>
        </div>
    )
};

export default AdminChatManagement;
