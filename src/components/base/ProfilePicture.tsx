"use client";
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateUserProfilePicture } from '@/service/userService';
import { useUserStore } from '@/stores/store';
import { Avatar, AvatarImage } from './Avatar';
import useClickOutside from '@/hooks/useClickOutside';

const ProfilePicture = function () {
  const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
  const fetchProfilePictureUrl = useUserStore((state) => state.fetchProfilePictureUrl);
  const updateProfilePictureUrl = useUserStore((state) => state.updateProfilePictureUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUserStore();

  // Ref for detecting clicks outside
  const profileRef = useRef<HTMLDivElement | null>(null);

  // State to track edit modes 
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    fetchProfilePictureUrl();
  }, [fetchProfilePictureUrl]);

  // Reset zoom state when profile picture changes after upload
  useEffect(() => {
    setIsZoomed(false);
  }, [profilePictureUrl]);

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
      if (response.success) {
        // Update the profile picture with the new image URL
        updateProfilePictureUrl(response.data.profilePictureUrl);
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

  // Use the custom hook for the image Editing
  useClickOutside(profileRef, () => setIsZoomed(false));

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative mb-4" ref={profileRef}>
        {profilePictureUrl ? (
          <div className={`relative transition-all duration-300 ease-in-out ${
            isZoomed ? 'scale-150 z-10' : 'scale-100'
          }`}>
            <Avatar className={`w-24 h-24 cursor-pointer ${
              isZoomed ? 'border-2 border-blue-500' : ''
              }`}
              onFocus={() => setIsZoomed(true)}
              onClick={handleAvatarClick}
            >
              <AvatarImage src={profilePictureUrl} alt="User profile" />
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
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg cursor-pointer"
               onClick={handleAvatarClick}>
            <span className="text-3xl font-bold text-white">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
            
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
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h2>
    </div>
  )
}

export default ProfilePicture;
