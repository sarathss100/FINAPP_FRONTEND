import { UserSideBar } from '@/components/user/base/UserSideBar';
import ButterflyEffectPageBody from '@/components/user/butterfly-effect/ButterFlyEffectPageBody';

const ButterflyEffect = function () {
    return (
        <div className='flex h-screen'>
            <UserSideBar />
            <main
                className={`flex-1 bg-gray-100 transition-all duration-300 overflow-y-auto`}
                style={{ maxHeight: "100vh" }}
            >
                <div className='p-6'>
                  <ButterflyEffectPageBody />
                </div>
            </main>
        </div>
    )
}

export default ButterflyEffect;
