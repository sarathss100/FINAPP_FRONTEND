import AccountsBody from '@/components/user/accounts/AccountsBody';
import { UserSideBar } from '@/components/user/base/UserSideBar';

const Accounts = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <AccountsBody />
                </div>
            </main>
        </div>
    )
}

export default Accounts;
