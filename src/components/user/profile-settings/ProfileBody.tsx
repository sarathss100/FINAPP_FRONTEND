"use client";
import { LockIcon, ShieldIcon, UserIcon, DownloadIcon, TrashIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '../../base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../base/Card';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores/store';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import auth from '@/lib/firebaseConfig';
import { deleteAccount, getUserProfileDetails, toggleUserTwoFactorAuthentication } from '@/service/userService';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Input from '@/components/base/Input';
import RecaptchaComponent from '@/components/base/auth/RecaptchaComponent';
import PhoneNumberVerificationModal from '@/components/base/auth/forgetpassword/PhoneNumberVerificationModal';
import ResetPasswordOtpVerificationModal from '@/components/base/auth/forgetpassword/ResetPasswordOtpVerificationModal';
import ResetPasswordModal from '@/components/base/auth/forgetpassword/ResetPasswordModal';
import { Switch } from '@/components/base/switch';
import { signout } from '@/service/authenticationService';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ProfilePicture from '@/components/base/ProfilePicture';

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
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  // Access Zustand store's state and actions
  const { user, login, logout } = useUserStore();

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

          // Update the 2FA state
          setIsTwoFactorEnabled(userData.is2FA);

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
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleToggle2FA = async function () {
    try {
      const data = await toggleUserTwoFactorAuthentication();
      setIsTwoFactorEnabled(data.data.isToggled);
      toast.success(data.message);
    } catch (error) {
      toast.error((error as Error).message || `Failed to toggle 2FA`);
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

  const handleAccountDeletion = async function () {
    try {
      const data = await deleteAccount();
      if (data.data.isDeleted) {
        await handleSignOut();
      }
    } catch (error) {
      toast.error((error as Error).message || `Failed to Deleted Account`);
    }
  }

  // Open the confirmation modal
  const openDeleteConfirmation = function () {
    setIsDeleteConfirmationOpen(true);
  };

  // Close the confirmation modal
  const closeDeleteConfirmation = function () {
    setIsDeleteConfirmationOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto"
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
          <p className="mt-4 text-center text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="p-8 rounded-lg shadow-lg bg-white border border-red-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg text-center font-medium">{error}</p>
          <p className="mt-2 text-gray-500 text-center">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1184px] mx-auto p-4 md:p-8 font-sans min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Profile & Settings`} tag={`Manage your account settings and preferences`} />
      
      {/* Profile Picture Component */}
      <ProfilePicture />
      
      {/* Account Settings Card */}
      <Card className="mb-6 shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl font-semibold text-[#004a7c] flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                First Name
              </label>
              <Input
                defaultValue={user?.firstName}
                className="h-[42px] font-normal text-base rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Last Name
              </label>
              <Input
                defaultValue={user?.lastName}
                className="h-[42px] font-normal text-base rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Phone Number
            </label>
            <Input
              defaultValue={user?.phoneNumber}
              className="h-[42px] font-normal text-base rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="mb-6 shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl font-semibold text-[#004a7c] flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <LockIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">Password</p>
                  <p className="text-sm text-gray-500">Secure your account with a strong password</p>
                </div>
              </div>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 px-4 py-2 rounded-md font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPhoneNumberVerificationModalOpen(true);
                }}
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <ShieldIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isTwoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={isTwoFactorEnabled}
                  onCheckedChange={() => handleToggle2FA()}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
          {/* Hidden reCAPTCHA Container */}
          <RecaptchaComponent onRecaptchaInit={handleRecaptchaInit} />
        </CardContent>
      </Card>

      {/* Account Management Card */}
      <Card className="shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl font-semibold text-[#004a7c] flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <DownloadIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">Back up Data</p>
                  <p className="text-sm text-gray-500">Export your account data for safekeeping</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200">
                Import/Export
              </Button>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently remove your account and data</p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={openDeleteConfirmation}
              >
                Delete Account
              </Button>
            </div>
          </div>
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

      {/* Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        aria-labelledby="delete-account-confirmation-title"
        aria-describedby="delete-account-confirmation-description"
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '12px'
          }
        }}
      >
        <DialogTitle id="delete-account-confirmation-title" style={{ fontWeight: 'bold', color: '#DC2626' }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-confirmation-description">
            This action cannot be undone. All your data will be permanently deleted.
            Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeDeleteConfirmation} 
            className="text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAccountDeletion(); // Call the deletion function
              closeDeleteConfirmation(); // Close the modal
            }}
            className='bg-red-600 hover:bg-red-700 text-white'
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};
