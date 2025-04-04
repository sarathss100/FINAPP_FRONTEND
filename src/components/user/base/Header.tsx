import Input from '@/components/base/Input';
import { Avatar, AvatarImage } from '../../base/Avatar';
import { SearchIcon, BellIcon } from 'lucide-react';
import Image from 'next/image';

const UserHeader = function () {
    return (
        <header className="flex justify-between items-center mb-6">
        <div className="relative w-[373px]">
          <div className="absolute left-3 top-3">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            className="pl-10 h-[42px] font-normal text-base"
            placeholder="SearchIcon..."
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src="/chat-bubble.png"
              alt="Chat bubble"
              width={25}
              height={25}
            />
            {/* <span className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full" /> */}
          </div>
          <div className="relative">
            <BellIcon className="h-6 w-6" />
            {/* <span className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full" /> */}
          </div>
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarImage src="./img-1.png" alt="User profile" />
            </Avatar>
            {/* <span className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full" /> */}
          </div>
        </div>
      </header>
    )
}

export default UserHeader;
