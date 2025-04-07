"use client";
import Input from '@/components/base/Input';
import { Avatar, AvatarImage } from '../../base/Avatar';
import { SearchIcon, BellIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserProfilePictureUrl, updateUserProfilePicture } from '@/service/userService';

const UserHeader = function () {
  const [isZoomed, setIsZoomed] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('./user.png');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfilePictureUrl();
        if (response.success) {
          const userData = response.data;
          setProfilePicture(userData.userProfilePictureUrl);
        } 
      } catch (error) {
        toast.error((error as Error).message || `Something went wrong while fetching data`);
      } 
    };
    fetchUserData();
  }, []);

  // Reset zoom state when profile picture changes after upload
  useEffect(() => {
    setIsZoomed(false);
  }, [profilePicture]);

  const handleAvatarClick = () => {
    if (isUploading) return;
    setIsZoomed(!isZoomed);
  };

  const handleEditButtonClick = function (event: React.MouseEvent) {
    event.stopPropagation();

    // Trigger file input dialog
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (e: Event) {
      const target = e.target as HTMLInputElement;
      if (!target.files || !target.files[0]) return;

      const file = target.files[0];
      handleFileChange(file);
    };

    input.click();
  }

  const handleFileChange = async (file: File) => {
    setIsUploading(true);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        // Call the API route to upload the image to Cloudinary
        const response = await updateUserProfilePicture(formData);

        if (response.data.userProfilePictureUrl) {
          // Update the profile picture with the new image URL
          setProfilePicture(response.data.userProfilePictureUrl);
          toast.success(`Profile picture updated Successfully`);
          // The useEffect will handle resetting the zoom state
        }
        
      } catch (error) {
        console.error(`Error uploading images:`, error);
        toast.error((error as Error).message || `An error occurred while uploading the image.`);
      } finally {
        setIsUploading(false);
      }
  };

  
  return (
    <header className="flex justify-between items-center mb-6">
      {/* Search bar */}
      <div className="relative w-[373px]">
        <div className="absolute left-3 top-3">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          className="pl-10 h-[42px] font-normal text-base"
          placeholder="Search..."
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Chat Bubble Icon */}
        <div className="relative">
          <Image
            src="/chat-bubble.png"
            alt="Chat bubble"
            width={25}
            height={25}
          />
        </div>

        {/* Notification Bell Icon */}
        <div className="relative">
          <BellIcon className="h-6 w-6" />
        </div>

        {/* Avatar */}
        <div className={`relative transition-all duration-300 ease-in-out ${
          isZoomed ? 'scale-150 z-10' : 'scale-100'
        }`}>
          <Avatar className={`w-8 h-8 cursor-pointer ${
            isZoomed ? 'border-2 border-blue-500' : ''
            }`}
            onClick={handleAvatarClick}
          >
            <AvatarImage src={profilePicture} alt="User profile" />
          </Avatar>

          {/* Edit Button (Show only when zoomed) */}
          {isZoomed && (
            <button
              className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md'
              onClick={handleEditButtonClick}
            >
              ✏️
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default UserHeader;
