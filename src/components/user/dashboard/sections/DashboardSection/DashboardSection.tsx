"use client";
import {
  BarChart3Icon,
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from '@/components/base/Card';
import useInvestmentStore from "@/stores/investment/investmentStore";
import useDebtStore from "@/stores/debt/debtStore";
import { useAccountsStore } from "@/stores/accounts/accountsStore";
import { useGoalStore } from "@/stores/goals/goalStore";

const DashboardSection = function () {
  const totalBalance = useAccountsStore((state) => state.totalBalance);
  const totalGoalAmount = useGoalStore((state) => state.totalActiveGoalAmount);
  const totalInvestmentValue = useInvestmentStore((state) => state.totalInvestedAmount);
  const totalDebt = useDebtStore((state) => state.totalOutstandingDebtAmount);

  // Data for dashboard cards
  const dashboardCards = [
    {
      title: "Total Balance",
      amount: `₹ ${totalBalance.toFixed(2) || 0}`,
      isPositive: true,
      icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Goal Quest",
      amount: `₹ ${totalGoalAmount.toFixed(2) || 0}`,
      isPositive: true,
      icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Total Investments",
      amount: `₹ ${totalInvestmentValue.toFixed(2) || 0}`,
      isPositive: true,
      icon: <BarChart3Icon className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Total Debt",
      amount: `₹ ${totalDebt.toFixed(2) || 0}`,
      isPositive: false,
      icon: <TrendingDownIcon className="h-4 w-4 text-red-500" />,
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSection;
