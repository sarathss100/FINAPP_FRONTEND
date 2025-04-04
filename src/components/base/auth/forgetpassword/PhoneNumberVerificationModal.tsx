import React from 'react';
import Image from 'next/image';
import IPhoneNumberVerificationModalProps from './inteface/IPhoneNumberVerificationModalProps';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneNumberFormValues, PhoneNumberVerifySchema } from '@/lib/validationSchemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PhoneIcon } from "lucide-react";
import { verifyPhoneNumber } from '@/service/authenticationService';
import { Card, CardContent } from '../../Card';
import Input from '../../Input';
import Label from '../../Label';
import Button from '../../Button';

// PhoneNumber Verification Modal Component
const PhoneNumberVerificationModal = ({
  onClose,
  onSuccess,
  onFailure,
  isLoading
}: IPhoneNumberVerificationModalProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(PhoneNumberVerifySchema)
  });

  // Handle Phone Number Verification
  const handlePhoneNumberVerification: SubmitHandler<PhoneNumberFormValues> = async (phone) => {
    try {
      const phoneNumber = phone.phone_number;
      const confirmation = await verifyPhoneNumber(phoneNumber);
      
      if (confirmation) {
        onSuccess(phone.phone_number); 
      }

    } catch (error) {
        const errorMessage = (error as Error).message || `Failed to Verify the Phone Number, Please try again later`;
        onFailure(errorMessage);
    } 
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] flex justify-center items-center">
      <Card className="w-[480px] bg-white rounded-2xl border-0 shadow-md">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handlePhoneNumberVerification)} className="space-y-6">
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
              Phone Number Verification
            </h2>

            {/* Description */}
            <div className="space-y-2 text-center">
              <p className="font-normal text-base text-gray-600 font-['Poppins',Helvetica]">
                Please Enter a Valid Phone Number
              </p>
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
          
            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#004a7c] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Submit'}
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

export default PhoneNumberVerificationModal;
