'use client';
import { Card, CardContent } from '../components/Card';
import Image from 'next/image';
import Button from '../components/button';
import Label from '../components/Label';
import Input from '../components/Input';
import { LockIcon, PhoneIcon } from "lucide-react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormValues, signupSchema } from '../lib/validationSchemas';
import React, { useState } from 'react';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import auth from '../lib/firebaseConfig';
import RecaptchaComponent from './RecaptchaComponent';
import OtpVerificationModal from './OtpVerificationModal';

const SignupForm = function () {
  const [formData, setFormData] = useState<SignupFormValues | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      setLoading(true);
      setFormData(data);
      if (!recaptchaVerifier) {
        throw new Error(`reCAPTCHA  verifier not initialized`);
      }
      // Send OTP to the provided phone number 
      const result = await signInWithPhoneNumber(auth, `+91 ${data.phone_number}`, recaptchaVerifier);
      setConfirmationResult(result);
      setPhoneNumber(data.phone_number);
      setIsModalOpen(true);
    } catch (error) {
      console.error(`Error sending OTP:`, (error as Error).message);
    } finally {
      setLoading(false);
    }
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
                Create Account
              </h2>
              <p className="text-base font-normal text-gray-500">
                Start managing your finances today
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="First Name"
                    className={`h-[46px] border-gray-300 ${errors.first_name ? "border-red-500" : ""}`}
                    {...register("first_name")}
                  />
                      
                  {errors.first_name && (
                    <p className="text-red-500 text-xs">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Last Name"
                    className={`h-[46px] border-gray-300 ${errors.last_name ? "border-red-500" : ""
                      }`}
                    {...register("last_name")}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

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

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3.5 h-4 w-3.5 text-gray-400" />
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    className={`h-[46px] pl-10 border-gray-300 ${errors.confirm_password ? "border-red-500" : ""
                      }`}
                    {...register("confirm_password")}
                  />
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs">{errors.confirm_password.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input
                  type='checkbox'
                  id='terms'
                  {...register('terms', { required: true })}
                  className="rounded-[1px] border-black border-[0.5px] mt-0.5"
                />
                <div className="text-sm text-gray-600">
                  <Label htmlFor="terms" className="font-normal">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms.message}</p>
              )}

            <Button type='submit' className="w-full h-11 bg-[#004a7c] text-white" disabled={loading}>
              {
                loading ? ( 'Sending OTP...') : ('Create Account')}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">Already have an account?</p>
              <a href="#" className="text-blue-600 text-base">
                Sign in
              </a>
            </div>
        
            {/* Hidden reCAPTCHA Container */}
            <RecaptchaComponent onRecaptchaInit={(verifier) => setRecaptchaVerifier(verifier)} />
          </CardContent>
        </Card>
        {/* OTP Verification Modal */}
        {isModalOpen && (
          <OtpVerificationModal
            phoneNumber={phoneNumber}
            onClose={() => setIsModalOpen(false)}
            confirmationResult={confirmationResult}
            formData ={formData}
          />
        )}
    </>
  ) 
};

export default SignupForm;
