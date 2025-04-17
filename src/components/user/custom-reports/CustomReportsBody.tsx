import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Separator from '@/components/base/Separator';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Image from 'next/image';

// Define data for expense category cards
const expenseCategories = [
  {
    title: "Very Expensive",
    description: "expensive Expense",
    count: 3,
    color: "red",
    borderColor: "border-red-500",
    badgeBg: "bg-red-100",
    badgeText: "text-red-500",
  },
  {
    title: "Ok ok Expense",
    description: "Budget limits and warnings",
    count: 2,
    color: "amber",
    borderColor: "border-amber-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-500",
  },
  {
    title: "Affordable Expense",
    description: "Sensible expenses",
    count: 1,
    color: "emerald",
    borderColor: "border-emerald-500",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-500",
  },
  {
    title: "Good Expense",
    description: "Very Sensible one",
    count: 4,
    color: "blue",
    borderColor: "border-blue-500",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-500",
  },
];

// Define data for expense sections
const expenseSections = [
  {
    title: "Expense that way beyond the affordability",
    icon: "/bill_icon.svg",
    bgColor: "",
    items: [
      {
        title: "Gift",
        description: "Due in 2 days • $145.00",
        icon: "/alert_icon.svg",
        bgColor: "bg-red-50",
      },
      {
        title: "Internet Bill",
        description: "Due in 5 days • $79.99",
        icon: "/schedule_icon.svg",
        bgColor: "",
      },
    ],
  },
  {
    title: "Expense For the Wants",
    icon: "/budget_icon.svg",
    bgColor: "",
    items: [
      {
        title: "Dining Budget",
        description: "85% of monthly budget used",
        icon: "/budget_alert_icon.svg",
        bgColor: "bg-amber-50",
      },
    ],
  },
  {
    title: "Expense For the Needs",
    icon: "/goal_icon.svg",
    bgColor: "",
    items: [
      {
        title: "Vacation Fund",
        description: "Reached 75% of your goal!",
        icon: "/goal_progress_icon.svg",
        bgColor: "bg-emerald-50",
      },
    ],
  },
  {
    title: "Self Investment",
    icon: "/account_icon.svg",
    bgColor: "",
    items: [
      {
        title: "Security Alert",
        description: "New device login detected",
        icon: "/security_shield_icon.svg",
        bgColor: "bg-blue-50",
      },
      {
        title: "Large Transaction",
        description: "Transaction of $500+ detected",
        icon: "/transaction_icon.svg",
        bgColor: "",
      },
    ],
  },
];

const CustomReportsBody = function () {
  return (
    <main className="flex flex-col items-start relative">
      <div className="relative w-full max-w-[1440px] bg-neutral-100 py-6">
        {/* Header with search and profile */}
        <UserHeader />

        {/* Page title */}
        <PageTitle title={`CustomReports`} tag={`Get your custom reports`} />

        {/* Expense Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {expenseCategories.map((category, index) => (
            <Card
              key={index}
              className={`bg-white rounded-xl border-l-4 ${category.borderColor} shadow-[0px_1px_2px_#0000000d]`}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base">
                    {category.title}
                  </h2>
                  <Badge
                    className={`${category.badgeBg} ${category.badgeText} rounded-full px-2 py-1 font-normal`}
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

        {/* Main Content Card */}
        <Card className="w-full bg-white rounded-xl shadow-[0px_1px_2px_#0000000d]">
          <CardContent className="p-4 space-y-6">
            {expenseSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <div className="flex items-center">
                  <Image className="mr-2" alt="Icon" src={section.icon} width={16} height={16} />
                  <h2 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-lg">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`${item.bgColor || "border border-solid border-gray-100"} rounded-lg p-4 flex justify-between items-center`}
                    >
                      <div className="flex items-start">
                        <div className="flex items-center justify-center mr-3">
                          <Image alt="Icon" src={item.icon} width={20} height={20} />
                        </div>
                        <div>
                          <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base mb-2">
                            {item.title}
                          </h3>
                          <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="text-[#00a9e0] font-['Poppins',Helvetica] bg-transparent hover:text-white"
                      >
                        Amount
                      </Button>
                    </div>
                  ))}
                </div>

                {sectionIndex < expenseSections.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CustomReportsBody;
