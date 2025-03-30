'use client';
import { Card, CardContent } from './Card';
import Image from 'next/image';
import Button from './button';
import Label from './Label';
import Input from './Input';
import { LockIcon, PhoneIcon } from "lucide-react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormValues, signInSchema } from '../lib/validationSchemas';
import React, { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-toastify';
// import { useUserStore } from '@/stores/store';
// import IUser from '@/stores/interfaces/IUser';
import ISigninResponse from '@/types/ISigninResponse';

const SigninForm = function () {
  const [loading, setLoading] = useState(false);
  // const { login } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    try {
      setLoading(true);
      const response = await apiClient.post<ISigninResponse>(`api/v1/auth/signin`, data);

      if (response.data.success) {
        // const userData: IUser = {
        //   userId: response.data.data.userId,
        //   role: response.data.data.role,
        //   isLoggedIn: true
        // }
        // login(userData);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.log(`Error during sign-in:`, error);
      toast.error(error?.response?.data?.message || `An error occured during SignIn`)
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
                Welcome Back
              </h2>
              <p className="text-base font-normal text-gray-500">
                Sign in to manage your finances
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between mt-4">
              <a
                href="#"
                className="text-sm text-blue-600 font-normal font-['Poppins',Helvetica]"
              >
                Forgot password?
              </a>
            
              <a
                href="#"
                className="text-sm text-blue-600 font-normal font-['Poppins',Helvetica]"
              >
                I need more options
              </a>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Don&apos;t have an account?</p>
              <a href="/signup" className="text-blue-600 text-md">
                Sign Up
              </a>
            </div>
          </CardContent>
        </Card>
    </>
  ) 
};

export default SigninForm;
