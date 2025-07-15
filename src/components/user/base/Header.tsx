"use client";
import { Avatar, AvatarImage } from '../../base/Avatar';
import { BellIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/store';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chat/chatStore';
import { useNotificationStore } from '@/stores/notifications/notificationStore';

const UserHeader = function () {
  const profilePicture = useUserStore((state) => state.profilePicture);
  const fetchProfilePictureUrl = useUserStore((state) => state.fetchProfilePictureUrl);
  const toggleChat = useChatStore((state) => state.toggleChat);
  
  const router = useRouter();
;
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchProfilePictureUrl();
  }, [fetchProfilePictureUrl]);

  const handleAvatarClick = function () {
    router.push('/profile-settings');
  }

  const handleChatBubbleClick = function () {
    toggleChat();
  }

  const handleChatIconClick = function () {
    router.push('/notifications');
  }
  
  return (
    <header className="flex justify-end items-center mb-6">
      <div className="flex items-center gap-4">
        {/* Chat Bubble Icon */}
        <div 
          className="relative cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={handleChatBubbleClick}
        >
          <Image
            src="/chat-bubble.png"
            alt="Chat bubble"
            width={25}
            height={25}
          />
        </div>

        {/* Notification Bell Icon */}
        <div className="relative" onClick={handleChatIconClick}>
          <BellIcon className="h-6 w-6" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="relative cursor-pointer" onClick={handleAvatarClick}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={profilePicture.image ? `data:${profilePicture.contentType};base64,${profilePicture.image}` : '/user.png'} alt="User profile" />
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default UserHeader;