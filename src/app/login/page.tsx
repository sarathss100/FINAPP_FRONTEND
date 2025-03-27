import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SigninForm from '@/components/SigninForm';

const Login = function () {
    return (
        <div className='flex flex-col min-h-screen bg-white'>
            <Header isSignupPage={false}/>
            <main className="flex-1 flex items-center justify-center py-16">
                <SigninForm />
            </main>
            <Footer />
        </div>
    )
}

export default Login;
