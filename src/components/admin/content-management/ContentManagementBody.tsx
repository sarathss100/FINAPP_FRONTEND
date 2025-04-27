import { BellIcon, ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Input from '@/components/base/Input';
import Image from 'next/image';

const ContentManagementBody = function () {
  // Card data for content management sections
  const contentCards = [
    {
      id: 1,
      icon: "/bell_blue_icon.svg",
      badgeText: "12 Templates",
      title: "Notification Templates",
      description: "Manage in-app notification templates and settings",
    },
    {
      id: 2,
      icon: "/mail_blue_icon.svg",
      badgeText: "8 Templates",
      title: "Email Templates",
      description: "Customize email communications and campaigns",
    },
    {
      id: 3,
      icon: "/question_blue_icon.svg",
      badgeText: "24 Articles",
      title: "FAQ Management",
      description: "Update and organize frequently asked questions",
    },
    {
      id: 4,
      icon: "/document_blue_icon copy.svg",
      badgeText: "15 Docs",
      title: "Help Documentation",
      description: "Manage user guides and documentation",
    },
    {
      id: 5,
      icon: "/files_blue_icon.svg",
      badgeText: "32 Resources",
      title: "Resource Library",
      description: "Organize educational materials and resources",
    },
    {
      id: 6,
      icon: "/plus_blue_icon.svg",
      badgeText: "",
      title: "Quick Actions",
      description: "",
      hasAction: true,
    },
  ];

  return (
    <main className="w-full max-w-[1296px] p-8">
      {/* Header with search and profile */}
      <header className="flex justify-between items-center mb-12">
        <div className="relative w-[373px]">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 h-[42px] font-['Poppins',Helvetica] text-[#adaebc]"
            placeholder="SearchIcon..."
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <BellIcon className="w-3.5 h-4 text-gray-600" />
            <span className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: "url(../img.png)" }}
          ></div>
        </div>
      </header>

      {/* Content Management Section */}
      <section>
        <div className="mb-12 px-4">
          <h1 className="text-3xl text-[#004a7c] font-['Poppins',Helvetica] leading-[30px] mb-2">
            Content Management
          </h1>
          <p className="text-base text-gray-600 font-['Poppins',Helvetica] leading-4">
            Manage all your content and communications from one place
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-6 px-4">
          {contentCards.map((card) => (
            <Card
              key={card.id}
              className="rounded-xl shadow-[0px_1px_2px_#0000000d] border-0"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={30}
                    height={30}
                  />
                  {card.badgeText && (
                    <Badge className="bg-[#00a9e01a] text-[#00a9e0] font-normal rounded-full px-3 py-1 h-7">
                      {card.badgeText}
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl text-[#004a7c] font-['Poppins',Helvetica] mb-4">
                  {card.title}
                </h2>

                {card.description && (
                  <p className="text-base text-gray-600 font-['Poppins',Helvetica] mb-8">
                    {card.description}
                  </p>
                )}

                {card.hasAction ? (
                  <Button
                    className="bg-[#00a9e01a] text-[#00a9e0] rounded-lg h-10 px-4 flex items-center gap-2"
                  >
                    <PlusIcon className="w-3.5 h-4" />
                    <span>New Template</span>
                  </Button>
                ) : (
                  <div className="flex items-center text-[#00a9e0] cursor-pointer">
                    <span className="mr-2">Manage</span>
                    <ChevronRightIcon className="w-3.5 h-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ContentManagementBody;
