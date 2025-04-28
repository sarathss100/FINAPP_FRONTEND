"use client";
import Input from '@/components/base/Input';
import { Avatar, AvatarImage } from '../../base/Avatar';
import { SearchIcon, BellIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/stores/store';
import useClickOutside from '@/hooks/useClickOutside';
import { useRouter } from 'next/navigation';

const UserHeader = function () {
  const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
  const fetchProfilePictureUrl = useUserStore((state) => state.fetchProfilePictureUrl);

  // Refs for detecting clicks outside
  const searchRef = useRef<HTMLDivElement | null>(null);
  
  // State to track edit modes 
  const [isSearchEditing, setIsSearchEditing] = useState(false);

  // Initialize the router for navigation
  const router = useRouter();

  useEffect(() => {
    fetchProfilePictureUrl();
  }, [fetchProfilePictureUrl]);

  // customHook to handle the search bar outside click
  useClickOutside(searchRef, () => setIsSearchEditing(false));

  // Function to handle avatar click
  const handleAvatarClick = function () {
    router.push('/profile-settings');
  }
  
  return (
    <header className="flex justify-between items-center mb-6">
      {/* Search bar */}
      <div className="relative w-[373px]" ref={searchRef}>
        <div className="absolute left-3 top-3">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          className={`pl-10 h-[42px] font-normal text-base ${
            isSearchEditing ? 'border-blue-500' : ''
          }`}
          placeholder="Search..."
          onFocus={() => setIsSearchEditing(true)} // Enable edit mode on focus
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
        <div className="relative cursor-pointer" onClick={handleAvatarClick}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={profilePictureUrl} alt="User profile" />
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default UserHeader;
