import React, { useEffect, useState } from 'react';
import IResetPasswordOtpVerificationModalProps from './inteface/IResetOtpVerificationModalProps';
import Button from '../button';
import Input from '../Input';
import { Card, CardContent } from '../Card';
import Image from 'next/image';

// OTP Verification Modal Component
const ResetPasswordOtpVerificationModal = ({
  onClose,
  onSuccess,
  onFailure,
  phoneNumber,
  confirmationResult,
  isLoading
}: IResetPasswordOtpVerificationModalProps) => {
  const [error, setError] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);

  // Combine OTP values into a single string
  const getOtp = () => otpValues.join('');

  // Handle input changes for OTP fields
  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input if value is entered
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Start the timer when the modal open 
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }

  }, [timer, canResend]);

  // Format the timer as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0': ''}${seconds}`;
  }

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (!confirmationResult) {
        throw new Error('No confirmationResult found. Please send OTP first.');
      }

      const otp = getOtp(); // Get the combined OTP value
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP.');
      }

      const confirmation = await confirmationResult.confirm(otp);

      if (confirmation) {
        onSuccess(true);
      }

    } catch (error) {
      let errorMessage = `OTP Verification Failed`;
      if (error?.response?.data?.message) {
        errorMessage = error?.response?.data?.message
      }
      onFailure(errorMessage);
    } 
  };

  const handleResendOTP = function () {
    setTimer(180);
    setCanResend(false);
    console.log('Resending OTP....');
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] flex justify-center items-center">
      <Card className="w-[480px] bg-white rounded-2xl border-0 shadow-md">
        <CardContent className="p-8">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
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
              OTP Verification
            </h2>

            {/* Description */}
            <div className="space-y-2 text-center">
              <p className="font-normal text-base text-gray-600 font-['Poppins',Helvetica]">
                We have sent a verification code to
              </p>
              <p className="font-normal text-base text-[#004a7c] font-['Poppins',Helvetica]">
                {`*******${phoneNumber.slice(7)}`}
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-4 w-full">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-14 h-14 text-center text-xl rounded-lg border-2 border-[#00a9e0] focus:border-[#00a9e0] focus:ring-0"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs leading-[1.5] text-center">{error}</p>
            )}

            {/* Timer */}
            <p className="text-sm text-center">
              <span className="text-gray-600">Code expires in</span>
              <span className="text-[#004a7c]"> {formatTime(timer)}</span>
            </p>

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#004a7c] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {/* Resend Option */}
            <p className="text-sm text-center">
              <span className="text-gray-600">Didn’t receive code?</span>
              <span className="text-[#00a9e0] cursor-pointer hover:underline">
                {canResend ? (
                  <span className='text-[#00a9e0] cursor-pointer hover:underline ml-1' onClick={handleResendOTP}>
                    Resend OTP 
                  </span>
                ): (
                    <span className='text-gray-400 ml-1'>Resend OTP</span>
                )}
              </span>
            </p>

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

export default ResetPasswordOtpVerificationModal;
