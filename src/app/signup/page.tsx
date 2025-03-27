import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SignupForm from '@/components/SignupForm';

const Signup = function () {

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <Header isSignupPage={true}/>
      <main className="flex-1 flex items-center justify-center py-8">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
};

export default Signup;
