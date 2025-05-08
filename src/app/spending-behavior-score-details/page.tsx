import { UserSideBar } from '@/components/user/base/UserSideBar';
import SpendingBehaviorScoreDetailsBody from '@/components/user/spending-score-behavior-details/SpendingBehaviorScoreDetailsBody';

const SpendingBehaviorScoreDetails = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                    <SpendingBehaviorScoreDetailsBody />
                </div>
            </main>
        </div>
    )
};

export default SpendingBehaviorScoreDetails;
