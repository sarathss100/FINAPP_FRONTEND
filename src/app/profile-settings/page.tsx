import { ProfileBody } from '@/components/profile/Profile';
import { UserSideBar } from '@/components/usersidebar/UserSideBar';

const Profile = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                
                <div className='p-6'>
                  <ProfileBody />
                </div>
            </main>
        </div>
    )
}

export default Profile;
