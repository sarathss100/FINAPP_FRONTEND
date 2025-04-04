import Footer from '@/components/guest/base/Footer';
import Header from '@/components/guest/base/Header';
import LandingPageBody from '@/components/guest/home/LandingPageBody';

const Home = function () {
    return (
        <div className='flex flex-col min-h-screen bg-white'>
            {/* Header Section */}
            <Header isSignupPage={false} />
            <main className='flex-1'>
                <LandingPageBody />
            </main>
            {/* Foorter Section */}
            <Footer />
        </div>
    )
}

export default Home;
