"use client";
import { LockIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '../../base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../base/Card';
// import { Switch } from '@radix-ui/react-switch';
// import Image from 'next/image';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores/store';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import auth from '@/lib/firebaseConfig';
import { getUserProfileDetails } from '@/service/userService';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Input from '@/components/base/Input';
import RecaptchaComponent from '@/components/base/auth/RecaptchaComponent';
import PhoneNumberVerificationModal from '@/components/base/auth/forgetpassword/PhoneNumberVerificationModal';
import ResetPasswordOtpVerificationModal from '@/components/base/auth/forgetpassword/ResetPasswordOtpVerificationModal';
import ResetPasswordModal from '@/components/base/auth/forgetpassword/ResetPasswordModal';

export const ProfileBody = function () {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPhoneNumberVerificationModalOpen, setIsPhoneNumberVerificationModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isPhoneNumberLoading, setIsPhoneNumberLoading] = useState(false);
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Access Zustand store's state and actions
  const { user, login } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user data already exists in Zustand
      if (user) {
        setLoading(false); // No need to fetch, data already exists
        return;
      }

      setLoading(true);
      try {
        const response = await getUserProfileDetails();
        if (response.success) {
          const userData = response.data;

          // Update Zustand store with user data
          login(userData);
        } else {
          setError(response.message || `Failed to fetch user data`);
        }
      } catch (error) {
        setError((error as Error).message || `An occured while fetchnig user data`)
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, login]);

  // Wrap onRecaptchaInit in useCallback
  const handleRecaptchaInit = useCallback((verifier: RecaptchaVerifier) => {
    setRecaptchaVerifier(verifier);
  }, []);

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
      setIsResetPasswordModalOpen(true);
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

  const handleFailure = (message: string) => {
    setIsPhoneNumberVerificationModalOpen(false);
    setIsOtpModalOpen(false);
    setIsResetPasswordModalOpen(false);
    toast.error(message || `Failed to Verify the Phone Number, Please try again Late`);
  }

  // Connected accounts data
  // const connectedAccounts = [
  //   {
  //     name: "Google",
  //     status: "Not connected",
  //     icon: "/frame-3.svg",
  //     connected: true,
  //   },
  //   {
  //     name: "Apple",
  //     status: "Not connected",
  //     icon: "/frame-2.svg",
  //     connected: false,
  //   },
  // ];

  // Family members data
  // const familyMembers = [
  //   {
  //     title: "Show Accounts",
  //     description: "Add on accounts",
  //     action: "Show Related Acconts",
  //   },
  //   {
  //     title: "Remove add on Account",
  //     description: "Remoces Add On Accounts",
  //     action: "Delete Account",
  //   },
  // ];

  // Account management data
  // const accountManagement = [
  //   {
  //     title: "Back up Data",
  //     description: "Export Data",
  //     action: "Export / Import",
  //   },
  //   {
  //     title: "Delete Account",
  //     description: "Destroy Data",
  //     action: "Delete Account",
  //   },
  // ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8H4c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

    return (
    <main className="max-w-[1184px] mx-auto p-8 font-sans">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Profile & Settings`} tag={`Manage your account settings and preferences`} />

      {/* Account Settings Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                defaultValue={user?.firstName}
                  className="h-[42px] font-normal text-base"
                  readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                defaultValue={user?.lastName}
                className="h-[42px] font-normal text-base"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              defaultValue={user?.phoneNumber}
              className="h-[42px] font-normal text-base"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <LockIcon className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium text-base">Password</p>
                </div>
              </div>
                <Button
                  className="text-blue bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPhoneNumberVerificationModalOpen(true);
                  }}
                >
                Change Password
              </Button>
            </div>

            {/* <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldIcon className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium text-base">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <Switch />
            </div> */}
            </div>
            {/* Hidden reCAPTCHA Container */}
            <RecaptchaComponent onRecaptchaInit={handleRecaptchaInit} />
        </CardContent>
      </Card>

      {/* Connected Accounts Card */}
      {/* <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={account.icon}
                    alt={account.name}
                    className="mt-1"
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="font-medium text-base">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.status}</p>
                  </div>
                </div>
                <Button
                  className={
                    account.connected ? "text-red-500" : "text-[#004a7c]"
                  }
                >
                  {account.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Family Members Card */}
      {/* <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Family memebers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-base">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Button
                  className={
                    item.action.includes("Delete")
                      ? "text-red-500"
                      : "text-[#004a7c]"
                  }
                >
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Account Management Card */}
      {/* <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accountManagement.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-base">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Button className="text-red-500">
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
        
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
            onClose={() => setIsOtpModalOpen(false)}
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
    </main>
  );
};
