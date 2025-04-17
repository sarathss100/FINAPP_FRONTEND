import {
  BarChart3Icon,
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from '@/components/base/Card';

const DashboardSection = function () {
  // Data for dashboard cards
  const dashboardCards = [
    {
      title: "Total Balance",
      amount: "$24,500",
      change: "+2.5% from last month",
      isPositive: true,
      icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Total Spending",
      amount: "$8,250",
      change: "-0.8% from last month",
      isPositive: false,
      icon: <TrendingDownIcon className="h-4 w-4 text-red-500" />,
    },
    {
      title: "Total Savings",
      amount: "$12,750",
      change: "+5.2% from last month",
      isPositive: true,
      icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Investments",
      amount: "$3,500",
      change: "+1.8% from last month",
      isPositive: true,
      icon: <BarChart3Icon className="h-4 w-4 text-blue-500" />,
    },
  ];

  return (
    <div className="w-full h-[148px] flex gap-6 mt-[10px]">
      {dashboardCards.map((card, index) => (
        <Card
          key={index}
          className="w-[262px] h-[148px] shadow-[0px_1px_2px_#0000000d] bg-white"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="font-['Poppins',Helvetica] font-normal text-gray-500 text-base leading-4">
                {card.title}
              </div>
              <div className="flex items-center justify-center">
                {card.icon}
              </div>
            </div>

            <div className="mb-4">
              <div className="font-['Poppins',Helvetica] font-normal text-black text-2xl leading-[normal]">
                {card.amount}
              </div>
            </div>

            <div>
              <div
                className={`font-['Poppins',Helvetica] font-normal text-sm leading-[normal] ${card.isPositive ? "text-emerald-500" : "text-red-500"}`}
              >
                {card.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSection;
