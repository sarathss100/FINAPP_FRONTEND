"use client";
import {
  BarChart3Icon,
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  CrownIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from '@/components/base/Card';
import useInvestmentStore from "@/stores/investment/investmentStore";
import useDebtStore from "@/stores/debt/debtStore";
import { useAccountsStore } from "@/stores/accounts/accountsStore";
import { useGoalStore } from "@/stores/goals/goalStore";
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/store";

const DashboardSection = function () {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const router = useRouter();

  const isSubscribed = useUserStore((state) => state.isSubscribed);

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
      isPremium: true, // Free feature
    },
    {
      title: "Goal Quest",
      amount: `₹ ${totalGoalAmount.toFixed(2) || 0}`,
      isPositive: true,
      icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
      isPremium: true, // Premium feature
    },
    {
      title: "Total Investments",
      amount: `₹ ${totalInvestmentValue.toFixed(2) || 0}`,
      isPositive: true,
      icon: <BarChart3Icon className="h-4 w-4 text-blue-500" />,
      isPremium: true, // Premium feature
    },
    {
      title: "Total Debt",
      amount: `₹ ${totalDebt.toFixed(2) || 0}`,
      isPositive: false,
      icon: <TrendingDownIcon className="h-4 w-4 text-red-500" />,
      isPremium: true, // Premium feature
    },
  ];

  // Premium Overlay Component
  const PremiumOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
      <div className="text-center">
        <CrownIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Premium</h3>
        <button
          onClick={() => setShowSubscribeModal(true)}
          className="bg-[#00a9e0] text-white px-3 py-1 rounded text-xs hover:bg-[#008dc4] transition-colors"
        >
          Upgrade
        </button>
      </div>
    </div>
  );

  // Subscribe Modal Component
  const SubscribeModal = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Premium Feature</h2>
          <button
            onClick={() => setShowSubscribeModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <CrownIcon className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            This feature is available for premium subscribers only. Upgrade your plan to access advanced analytics and management tools.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowSubscribeModal(false);
              router.push('/subscription');
            }}
            className="flex-1 bg-[#00a9e0] text-white py-2 px-4 rounded-lg hover:bg-[#008dc4] transition-colors"
          >
            Go to Subscription
          </button>
          <button
            onClick={() => setShowSubscribeModal(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full h-[148px] flex gap-6 mt-[10px]">
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            className="w-[262px] h-[148px] shadow-[0px_1px_2px_#0000000d] bg-white relative"
          >
            {/* Premium Overlay for restricted cards */}
            {card.isPremium && !isSubscribed && <PremiumOverlay />}
            
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="font-['Poppins',Helvetica] font-normal text-gray-500 text-base leading-4 flex items-center gap-2">
                  {card.title}
                  {card.isPremium && !isSubscribed && <CrownIcon className="h-3 w-3 text-yellow-500" />}
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

      {/* Subscribe Modal */}
      {showSubscribeModal && <SubscribeModal />}
    </>
  );
};

export default DashboardSection;