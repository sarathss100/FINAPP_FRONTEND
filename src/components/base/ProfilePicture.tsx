"use client";
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateUserProfilePicture } from '@/service/userService';
import { useUserStore } from '@/stores/store';
import { Avatar, AvatarImage } from './Avatar';
import useClickOutside from '@/hooks/useClickOutside';

const ProfilePicture = function () {
  const profilePicture = useUserStore((state) => state.profilePicture);
  const fetchProfilePictureUrl = useUserStore((state) => state.fetchProfilePictureUrl);
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
      if (response.success) {
        // Update the profile picture with the new image URL
        
        await fetchProfilePictureUrl();
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
        {profilePicture ? (
          <div className={`relative transition-all duration-300 ease-in-out ${
            isZoomed ? 'scale-150 z-10' : 'scale-100'
          }`}>
            <Avatar className={`w-24 h-24 cursor-pointer relative ${
              isZoomed ? 'border-2 border-blue-500' : ''
              } ${isUploading ? 'opacity-70' : ''}`}
              onFocus={() => setIsZoomed(true)}
              onClick={handleAvatarClick}
            > 
              
              <AvatarImage src={profilePicture.image ? `data:${profilePicture.contentType};base64,${profilePicture.image}` : '/user.png'} alt="User profile" />
              
              {/* Upload overlay with spinner */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="flex flex-col items-center">
                    {/* Spinner */}
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                    <span className="text-white text-xs font-medium">Uploading...</span>
                  </div>
                </div>
              )}
            </Avatar>

            {/* Edit Button (Show only when zoomed and not uploading) */}
            {isZoomed && !isUploading && (
              <button
                className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600 transition-colors'
                onClick={handleEditButtonClick}
              >
                ✏️
              </button>
            )}
          </div>
        ) : (
          <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg cursor-pointer relative ${
            isUploading ? 'opacity-70' : ''
          }`}
               onClick={handleAvatarClick}>
            <span className="text-3xl font-bold text-white">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
            
            {/* Upload overlay with spinner for fallback avatar */}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                <div className="flex flex-col items-center">
                  {/* Spinner */}
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                  <span className="text-white text-xs font-medium">Uploading...</span>
                </div>
              </div>
            )}
            
            {/* Edit Button (Show only when zoomed and not uploading) */}
            {isZoomed && !isUploading && (
              <button
                className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600 transition-colors'
                onClick={handleEditButtonClick}
              >
                ✏️
              </button>
            )}
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h2>
      
      {/* Upload status text */}
      {isUploading && (
        <p className="text-blue-600 text-sm mt-2 animate-pulse">
          Updating profile picture...
        </p>
      )}
    </div>
  )
}

export default ProfilePicture;