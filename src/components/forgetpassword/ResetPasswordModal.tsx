import React from 'react';
import Button from '../button';
import Input from '../Input';
import { Card, CardContent } from '../Card';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/lib/validationSchemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PhoneIcon } from "lucide-react";
import Label from '../Label';
import apiClient from '@/lib/apiClient';
import IResetPasswordModalProps from './inteface/IResetPasswordModalProps';

// Password Reset Modal Component
const ResetPasswordModal = ({
  onClose,
  onSuccess,
  onFailure,
  isLoading,
  phoneNumber
}: IResetPasswordModalProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema)
  });

  // Handle Password Reset
  const handleFormSubmission: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    try {
      const { password } = data;
      if (!phoneNumber) {
        throw new Error(`Phone is missing for form submission`);
      }
      const confirmation = await apiClient.post('api/v1/auth/change-password', { phone_number: phoneNumber, password });
      
      if (confirmation.status === 200) {
        onSuccess('Password updated Successfully'); 
      }

    } catch (error: unknown) {
      let errorMessage = `Failed to Reset the password, Please try again later`;
      if (error instanceof Error) {
        errorMessage = error?.response?.data?.message;
      }
      onFailure(errorMessage);
    } 
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] flex justify-center items-center">
      <Card className="w-[480px] bg-white rounded-2xl border-0 shadow-md">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handleFormSubmission)} className="space-y-6">
            {/* Logo/Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto">
              <Image
                alt="OTP Verification Icon"
                src="/group.png"
                width={46}
                height={46}
              />
            </div>

            {/* Title */}
            <h2 className="font-normal text-2xl text-[#004a7c] text-center leading-6 font-['Poppins',Helvetica]">
              Reset Password
            </h2>

            {/* Description */}
            <div className="space-y-2 text-center">
              <p className="font-normal text-base text-gray-600 font-['Poppins',Helvetica]">
                Please Enter New Password
              </p>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="newpassword" className="text-sm text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  placeholder="New Password"
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
              <Label htmlFor="confirm_password" className="text-sm text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm_password"
                  placeholder="Confirm Password"
                  className={`h-[46px] pl-10 border-gray-300 ${errors.confirm_password ? "border-red-500" : ""
                    }`}
                  {...register("confirm_password")}
                />
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs">{errors.confirm_password.message}</p>
              )}
            </div>
          
            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#004a7c] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
            <button
              onClick={onClose}
              className='mt-4 w-full text-sm text-gray-600 underline'
            >
              Cancel
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordModal;
