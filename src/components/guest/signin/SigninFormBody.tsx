'use client';
import { Card, CardContent } from '../../base/Card';
import Image from 'next/image';
import Button from '../../base/Button';
import Label from '../../base/Label';
import Input from '../../base/Input';
import { LockIcon, PhoneIcon } from "lucide-react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormValues, signInSchema } from '../../../lib/validationSchemas';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import auth from '@/lib/firebaseConfig';
import RecaptchaComponent from '../../base/auth/RecaptchaComponent';
import { signIn, signout } from '@/service/authenticationService';
import PhoneNumberVerificationModal from '@/components/base/auth/forgetpassword/PhoneNumberVerificationModal';
import ResetPasswordOtpVerificationModal from '@/components/base/auth/forgetpassword/ResetPasswordOtpVerificationModal';
import ResetPasswordModal from '@/components/base/auth/forgetpassword/ResetPasswordModal';
import { useUserStore } from '@/stores/store';

const SigninFormbody = function () {
  const [loading, setLoading] = useState(false);
  const [isPhoneNumberVerificationModalOpen, setIsPhoneNumberVerificationModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isPhoneNumberLoading, setIsPhoneNumberLoading] = useState(false);
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [isPasswordResetFlow, setIsPasswordResetFlow] = useState(false);
  const [role, setRole] = useState('');
  const router = useRouter();
  
  // Zustand store actions 
  const { logout } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema)
  });

  // Wrap onRecaptchaInit in useCallback
  const handleRecaptchaInit = useCallback((verifier: RecaptchaVerifier) => {
    setRecaptchaVerifier(verifier);
  }, []);

  const handleSignInSubmit: SubmitHandler<SignInFormValues> = async (formData) => {
    try {
      setLoading(true);
      const data = await signIn(formData);

      setRole(data.data.role);

      if (data.success && data.data.is2FA) {
        handlePhoneVerificationSuccess(formData.phone_number);
      } else {
        if (data.data.role === 'user') {
          useUserStore.getState().initializeSockets();
        }
        router.replace('/dashboard');
      }
    } catch (error) {
      toast.error((error as Error).message || `An error occured during SignIn`)
    } finally {
      setLoading(false);
    }
  }

  const handlePhoneVerificationSuccess = async (phone: string) => {
    setIsPhoneNumberLoading(true);
    try {
      setPhoneNumber(phone); // Store the verified phone number
      if (!recaptchaVerifier) {
          throw new Error(`reCAPTCHA  verifier not initialized`);
      }
      // Send OTP to the provided phone number 
      const result = await signInWithPhoneNumber(auth, `+91 ${phone}`, recaptchaVerifier);
      setConfirmationResult(result);
      setIsPhoneNumberVerificationModalOpen(false); // Close the phone verification modal
      setIsOtpModalOpen(true); // Open the OTP confirmation modal
    } catch (error) {
      console.error("Error sending OTP:", error);
      handleFailure((error as Error).message || "Failed to send OTP");
    } finally {
      setIsPhoneNumberLoading(false);
    }
  };

  const handleOTPVerificationSuccess = () => {
    setIsOTPLoading(true); 
    try {
      setIsOtpModalOpen(false) // Close the OTP confirmation modal
      if (isPasswordResetFlow) {
        setIsResetPasswordModalOpen(true);
      } else {
        if (role === 'user') {
          useUserStore.getState().initializeSockets();
        }
        // For 2FA, proceed to dashboard or next step
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Fail to verify OTP:", error);
      handleFailure((error as Error).message || "Failed to verify OTP");
    } finally {
      setIsOTPLoading(false);
    }
  }

  const handleResetPasswordSuccess = (message: string) => {
    setIsResetPasswordLoading(true);
    try {
      toast.success(message);
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error("Fail to Reset the Password:", error);
      handleFailure((error as Error).message || "Failed to Reset the Password");
    } finally {
      setIsResetPasswordLoading(false);
    }
  }

  // Function to handle sign out
  const handleSignOut = async function () {
    // Send logout request to backend 
    await signout();

    // Reset Zustand state
    logout();

    // Redirect to login page
    window.location.replace('/login');
  }

  const handleFailure = (message: string) => {
    handleSignOut();
    setIsPasswordResetFlow(false);
    setIsPhoneNumberVerificationModalOpen(false);
    setIsOtpModalOpen(false);
    setIsResetPasswordModalOpen(false);
    toast.error(message || `Failed to Verify the Phone Number, Please try again Late`);
  }

  return (
    <>
      <Card className="w-[448px] shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] rounded-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="flex justify-center mb-2">
                <Image
                  src="/logo.svg"
                  alt="FinApp Logo"
                  width={30}
                  height={30}
                />
              </div>
              <h2 className="text-2xl font-normal text-gray-900 mb-1">
                Welcome Back
              </h2>
              <p className="text-base font-normal text-gray-500">
                Sign in to manage your finances
              </p>
            </div>

            <form onSubmit={handleSubmit(handleSignInSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm text-gray-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone_number"
                    placeholder="Phone Number"
                    className={`h-[46px] pl-10 border-gray-300 ${errors.phone_number ? "border-red-500" : ""
                      }`}
                    {...register("phone_number")}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-red-500 text-xs">{errors.phone_number.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3.5 h-4 w-3.5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`h-[46px] pl-10 border-gray-300 ${errors.password ? "border-red-500" : ""
                      }`}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password.message}</p>
                )}
              </div>
            
              <Button type='submit' className="w-full h-11 bg-[#004a7c] text-white" disabled={loading}>
                {loading ? ( 'Signing In...') : ('Sign in')}
              </Button>
            </form>
          
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-center mt-4">
              <a
                onClick={(e) => {
                e.preventDefault();
                setIsPasswordResetFlow(true);
                  setIsPhoneNumberVerificationModalOpen(true);
                }}
                className="text-sm text-blue-600 font-normal font-['Poppins',Helvetica]"
              >
                Forgot password?
              </a>
            
              {/* <a
                href="#"
                className="text-sm text-blue-600 font-normal font-['Poppins',Helvetica]"
              >
                Use Passkey
              </a> */}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Don&apos;t have an account?</p>
              <a href="/signup" className="text-blue-600 text-md">
                Sign Up
              </a>
            </div>
          
            {/* Hidden reCAPTCHA Container */}
            <RecaptchaComponent onRecaptchaInit={handleRecaptchaInit} />
          </CardContent>
        </Card>
      
        {/* Phone Number Verification Modal */}
        {isPhoneNumberVerificationModalOpen && (
          <PhoneNumberVerificationModal
            onClose={() => setIsPhoneNumberVerificationModalOpen(false)}
            onSuccess={handlePhoneVerificationSuccess}
            onFailure={handleFailure}
            isLoading={isPhoneNumberLoading}
          />
        )}
      
        {/* OTP Verification Modal */}
        {isOtpModalOpen && (
          <ResetPasswordOtpVerificationModal
          onClose={() => { 
              setIsOtpModalOpen(false); 
              handleSignOut(); // Signout the user 
            }}
            onSuccess={handleOTPVerificationSuccess}
            onFailure={handleFailure}
            phoneNumber={phoneNumber}
            confirmationResult={confirmationResult}
            isLoading={isOTPLoading}
          />
        )}
      
        {/* Password Reset Modal */}
        {isResetPasswordModalOpen && (
          <ResetPasswordModal
            onClose={() => setIsResetPasswordModalOpen(false)}
            onSuccess={handleResetPasswordSuccess}
            onFailure={handleFailure}
            phoneNumber={phoneNumber}
            isLoading={isResetPasswordLoading}
          />
        )}
    </>
  ) 
};

export default SigninFormbody;
