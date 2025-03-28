import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LandingPage from '@/components/home/LandingPageBody';

const Home = function () {
    return (
        <div className='flex flex-col min-h-screen bg-white'>
            {/* Header Section */}
            <Header isSignupPage={false} />
            <main className='flex-1'>
                <LandingPage />
            </main>
            {/* Foorter Section */}
            <Footer />
        </div>
    )
}

export default Home;
