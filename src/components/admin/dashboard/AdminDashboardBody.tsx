import { BellIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Avatar } from '@/components/base/Avatar';
import { Badge } from '@/components/base/Badge';
import Input from '@/components/base/Input';
import Image from 'next/image';
import UserLogsSection from './sections/UserLogsSection/UserLogsSection';
import UsageStatisticsSection from './sections/UsageStatisticsSection/UsageStatisticsSection';
import PerformanceMetricsSection from './sections/PerformanceMetricsSection/PerformanceMetricsSection';

const AdminDashBoardBody = function () {
  return (
    <div className="w-full max-w-[1184px] mx-auto p-8">
      {/* Header with search and user profile */}
      <header className="flex justify-between items-center mb-8">
        {/* SearchIcon bar */}
        <div className="relative w-[373px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            className="pl-10 h-[42px] w-full"
            placeholder="SearchIcon..."
          />
        </div>

        {/* User profile and notifications */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-2 cursor-pointer">
              <BellIcon className="h-4 w-3.5" />
            </div>
            <Badge className="absolute top-0 right-0 h-2 w-2 p-0 bg-red-500" />
          </div>
          <Avatar className="h-10 w-10">
            <Image
              src="/img.png"
              alt="User profile"
              className="h-full w-full object-cover"
              height={24}
              width={24}
            />
          </Avatar>
        </div>
      </header>

      {/* Main content sections */}
      <div className="flex flex-col gap-6">
        <PerformanceMetricsSection />
        <UsageStatisticsSection />
        <UserLogsSection />
      </div>
    </div>
  );
}; 

export default AdminDashBoardBody;
