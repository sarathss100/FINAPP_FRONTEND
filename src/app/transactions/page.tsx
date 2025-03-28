import { UserSideBar } from '@/components/usersidebar/UserSideBar';

const Transactions = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main className={`flex-1 bg-gray-100 transition-all duration-300`}>
                <div className='p-6'>
                  <h1 className='text-2xl font-bold'>Transactions</h1>
                  <p>For Test Purpose</p>
                </div>
            </main>
        </div>
    )
}

export default Transactions;
