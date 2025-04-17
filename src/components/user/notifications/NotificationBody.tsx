import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Image from 'next/image';
import UserHeader from '../base/Header';

// Define notification category data
const categories = [
  {
    id: "bill-reminders",
    title: "Bill Reminders",
    description: "Upcoming and overdue bills",
    count: 3,
    color: "red",
    icon: "/bill_icon.svg",
  },
  {
    id: "budget-alerts",
    title: "Budget Alerts",
    description: "Budget limits and warnings",
    count: 2,
    color: "amber",
    icon: "/budget_icon.svg",
  },
  {
    id: "goal-progress",
    title: "Goal Progress",
    description: "Savings and milestone updates",
    count: 1,
    color: "emerald",
    icon: "/goal_icon.svg",
  },
  {
    id: "account-alerts",
    title: "Account Alerts",
    description: "Security and balance alerts",
    count: 4,
    color: "blue",
    icon: "/account_icon.svg",
  },
];

// Define notification data
const notifications = {
  "bill-reminders": [
    {
      id: 1,
      title: "Electricity Bill Due",
      description: "Due in 2 days • $145.00",
      icon: "/alert_icon.svg",
      action: "Pay Now",
      urgent: true,
    },
    {
      id: 2,
      title: "Internet Bill",
      description: "Due in 5 days • $79.99",
      icon: "/schedule_icon.svg",
      action: "Schedule",
      urgent: false,
    },
  ],
  "budget-alerts": [
    {
      id: 1,
      title: "Dining Budget",
      description: "85% of monthly budget used",
      icon: "/budget_alert_icon.svg",
      action: "View Budget",
      urgent: true,
    },
  ],
  "goal-progress": [
    {
      id: 1,
      title: "Vacation Fund",
      description: "Reached 75% of your goal!",
      icon: "/goal_progress_icon.svg",
      action: "View Progress",
      urgent: true,
    },
  ],
  "account-alerts": [
    {
      id: 1,
      title: "Security Alert",
      description: "New device login detected",
      icon: "/security_shield_icon.svg",
      action: "Review",
      urgent: true,
    },
    {
      id: 2,
      title: "Large Transaction",
      description: "Transaction of $500+ detected",
      icon: "/transaction_icon.svg",
      action: "View Details",
      urgent: false,
    },
  ],
};

const NotificationBody = function () {
  return (
    <div className="flex flex-col items-start relative">
      <div className="relative w-full max-w-[1440px] bg-neutral-100 py-6 px-6">
        {/* Header with search and profile */}
        <UserHeader />
        {/* Header */}
        <header className="w-full mb-8">
          <Card className="shadow-[0px_1px_2px_#0000000d]">
            <CardContent className="flex justify-between items-center p-4">
              <h1 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-2xl">
                Notifications
              </h1>

              <div className="flex items-center gap-4">
                <Button
                    className="text-[#004a7c] p-0 h-auto bg-transparent border-none hover:bg-transparent"
                >
                    <Image
                      className="mr-3"
                      alt="Mark as read icon"
                      src="/double_tick.svg"
                      height={18}
                      width={16}
                    />
                    <span className="font-['Poppins',Helvetica] text-base">
                      Mark all as read
                    </span>
                </Button>
                <Button className="p-0 h-auto bg-transparent hover:bg-transparent">
                  <Image
                    alt="Settings"
                    src="/settings.svg"
                    height={18}
                    width={18}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Category Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`border-l-4 border-l-${category.color}-500 shadow-[0px_1px_2px_#0000000d]`}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base">
                    {category.title}
                  </h2>
                  <Badge
                    className={`bg-${category.color}-100 text-${category.color}-500 rounded-full px-2 py-1 h-7`}
                  >
                    {category.count}
                  </Badge>
                </div>
                <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-sm">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notifications Content */}
        <Card className="shadow-[0px_1px_2px_#0000000d]">
          <CardContent className="p-4">
            {/* Bill Reminders Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Image
                  className="mr-2"
                  alt="Bill icon"
                  src="/bill_icon.svg"
                  width={12}
                  height={16}
                />
                <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-lg">
                  Bill Reminders
                </h2>
              </div>

              <div className="space-y-4">
                {notifications["bill-reminders"].map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg p-4 flex justify-between items-center ${
                      notification.urgent
                        ? "bg-red-50"
                        : "border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center justify-center mt-3 mr-3">
                        <Image
                          alt={notification.title}
                          src={notification.icon}
                          height={20}
                          width={20}
                        />
                      </div>
                      <div>
                        <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base mb-2">
                          {notification.title}
                        </h3>
                        <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-sm">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    <Button className="text-[#00a9e0] bg-transparent hover:text-white">
                      {notification.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Alerts Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Image
                  className="mr-2"
                  alt="Budget icon"
                  src="/budget_icon.svg"
                  height={16}
                  width={18}
                />
                <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-lg">
                  Budget Alerts
                </h2>
              </div>

              <div className="space-y-4">
                {notifications["budget-alerts"].map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-amber-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-start">
                      <div className="flex items-center justify-center mt-3 mr-3">
                        <Image
                          alt={notification.title}
                          src={notification.icon}
                          height={20}
                          width={20}
                        />
                      </div>
                      <div>
                        <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base mb-2">
                          {notification.title}
                        </h3>
                        <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-sm">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    <Button className="text-[#00a9e0] bg-transparent hover:text-white">
                      {notification.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Progress Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Image
                  className="mr-2"
                  alt="Goal icon"
                  src="/goal_icon.svg"
                  height={16}
                  width={16}
                />
                <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-lg">
                  Goal Progress
                </h2>
              </div>

              <div className="space-y-4">
                {notifications["goal-progress"].map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-emerald-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-start">
                      <div className="flex items-center justify-center mt-3 mr-3 ">
                        <Image
                          alt={notification.title}
                          src={notification.icon}
                          width={20}
                          height={20}
                        />
                      </div>
                      <div>
                        <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base mb-2">
                          {notification.title}
                        </h3>
                        <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-sm">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    <Button className="text-[#00a9e0] bg-transparent hover:text-white">
                      {notification.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Alerts Section */}
            <div>
              <div className="flex items-center mb-4">
                <Image
                  className="mr-2"
                  alt="Account icon"
                  src="/account_icon.svg"
                  height={16}
                  width={14}
                />
                <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-lg">
                  Account Alerts
                </h2>
              </div>

              <div className="space-y-4">
                {notifications["account-alerts"].map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg p-4 flex justify-between items-center ${
                      notification.urgent
                        ? "bg-blue-50"
                        : "border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center justify-center mt-3 mr-3">
                        <Image
                          alt={notification.title}
                          src={notification.icon}
                          height={20}
                          width={20}
                        />
                      </div>
                      <div>
                        <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base mb-2">
                          {notification.title}
                        </h3>
                        <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-sm">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    <Button className="text-[#00a9e0] bg-transparent hover:text-white">
                      {notification.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationBody;
