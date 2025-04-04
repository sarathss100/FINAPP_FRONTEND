import Footer from '@/components/guest/base/Footer';
import Header from '@/components/guest/base/Header';
import SignupFormBody from '@/components/guest/signup/SignupFormBody';

const Signup = function () {

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <Header isSignupPage={true}/>
      <main className="flex-1 flex items-center justify-center py-8">
        <SignupFormBody />
      </main>
      <Footer />
    </div>
  )
};

export default Signup;
