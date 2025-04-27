import { BellIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Avatar } from '@/components/base/Avatar';
import { Badge } from '@/components/base/Badge';
import Input from '@/components/base/Input';
import Image from 'next/image';
import DivWrapperByAnima from './sections/DivWrapperByAnima/DivWrapperByAnima';
import DivByAnima from './sections/DivByAnima/DivByAnima';

const AdminSystemSettingsBody = function () {
  return (
    <div className="flex flex-col w-full max-w-[1184px] mx-auto py-8 gap-8">
      {/* Header with search and profile */}
      <header className="flex justify-between items-center px-8 w-full">
        {/* SearchIcon bar */}
        <div className="relative w-[373px]">
          <Input className="pl-10" placeholder="SearchIcon..." />
          <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        </div>

        {/* Notifications and profile */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-2 cursor-pointer">
              <BellIcon className="w-3.5 h-4" />
            </div>
            <Badge
              className="absolute -top-1 right-0 w-2 h-2 p-0 bg-red-500"
              variant="destructive"
            />
          </div>
          <Avatar className="w-10 h-10">
            <Image
              src="/img.png"
              alt="User profile"
              className="object-cover"
              width={24}
              height={24}
            />
          </Avatar>
        </div>
      </header>

      {/* Main content sections */}
      <DivByAnima />
      <DivWrapperByAnima />
    </div>
  );
};

export default AdminSystemSettingsBody;
