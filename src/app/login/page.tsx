import Footer from '@/components/guest/base/Footer';
import Header from '@/components/guest/base/Header';
import SigninFormBody from '@/components/guest/signin/SigninFormBody';

const Signin = function () {
    return (
        <div className='flex flex-col min-h-screen bg-white'>
            <Header isSignupPage={false}/>
            <main className="flex-1 flex items-center justify-center py-16">
                <SigninFormBody />
            </main>
            <Footer />
        </div>
    )
}

export default Signin;
