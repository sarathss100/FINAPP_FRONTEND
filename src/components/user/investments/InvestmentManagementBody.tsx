"use client"
import React, { useCallback, useEffect } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import UserHeader from '../base/Header';
import Image from 'next/image';
import { PlusCircleIcon, TrendingUp, TrendingDown, Coins, Info } from 'lucide-react';
import InvestmentInputModal from './InvestmentInputModal';
import { createInvestment } from '@/service/investmentService';
import { toast } from 'react-toastify';
import { Investments } from '@/types/IInvestments';
import useInvestmentStore from "@/stores/investment/investmentStore";

const InvestmentManagementBody = function () {
  const totalInvestedAmount = useInvestmentStore((state) => state.totalInvestedAmount);
  const fetchTotalInvestedAmount = useInvestmentStore((state) => state.fetchTotalInvestedAmount);

  const handleStore = useCallback(() => {
    fetchTotalInvestedAmount();
  }, [fetchTotalInvestedAmount]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleCardExpansion = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSaveInvestment = async (investmentData: Investments) => {
    try {
      const response = await createInvestment(investmentData);
      if (response.success) {
        console.log(investmentData);
        handleCloseModal();
        toast.success(`Investment Added Successfully!`);
      }
    } catch (error) {
      console.error((error as Error).message || `Failed to add investments`);
    }
  };

  // Helper function to calculate profit/loss
  const calculateProfitLoss = (current: number, original: number) => {
    const difference = current - original;
    const percentage = ((difference / original) * 100).toFixed(2);
    return { difference, percentage, isProfit: difference >= 0 };
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Enhanced investment categories with detailed data
  const investmentCategories = [
    {
      id: 1,
      name: "Direct Stocks",
      icon: "/investment_icon.svg",
      type: "STOCK",
      currentValue: 845000,
      originalInvestment: 714000,
      details: {
        totalStocks: 15,
        topPerformer: "Reliance Industries",
        avgPurchasePrice: 47600,
        currentPrice: 56333,
        dividend: 12000,
        lastUpdated: "2 hours ago"
      },
      breakdown: [
        { name: "Reliance Industries", shares: 50, buyPrice: 2400, currentPrice: 2850, value: 142500 },
        { name: "TCS", shares: 30, buyPrice: 3200, currentPrice: 3650, value: 109500 },
        { name: "Infosys", shares: 25, buyPrice: 1400, currentPrice: 1520, value: 38000 }
      ]
    },
    {
      id: 2,
      name: "Mutual Funds",
      icon: "/mutualfund_icon.svg",
      type: "MUTUAL_FUND",
      currentValue: 520000,
      originalInvestment: 463000,
      details: {
        totalFunds: 8,
        sipAmount: 25000,
        avgReturns: "12.3%",
        bestPerformer: "HDFC Top 100",
        lastUpdated: "1 day ago"
      },
      breakdown: [
        { name: "HDFC Top 100", units: 1200, nav: 165, currentValue: 198000, invested: 175000 },
        { name: "SBI Blue Chip", units: 800, nav: 125, currentValue: 100000, invested: 92000 },
        { name: "ICICI Prudential", units: 1500, nav: 95, currentValue: 142500, invested: 135000 }
      ]
    },
    {
      id: 3,
      name: "Business",
      icon: "/business_icon.svg",
      type: "BUSINESS",
      currentValue: 439000,
      originalInvestment: 350000,
      details: {
        totalVentures: 2,
        ownership: "45%",
        monthlyIncome: 15000,
        lastValuation: "6 months ago",
        nextReview: "Dec 2025"
      },
      breakdown: [
        { name: "Tech Startup", investment: 200000, currentValue: 275000, ownership: "25%", monthlyReturn: 8000 },
        { name: "Restaurant Business", investment: 150000, currentValue: 164000, ownership: "20%", monthlyReturn: 7000 }
      ]
    },
    {
      id: 4,
      name: "Fixed Deposits",
      icon: "/fixeddeposit_icon.svg",
      type: "FIXED_DEPOSIT",
      currentValue: 215000,
      originalInvestment: 200000,
      details: {
        totalFDs: 3,
        avgInterestRate: "6.5%",
        nextMaturity: "Mar 2026",
        totalInterest: 15000,
        autoRenewal: "Enabled"
      },
      breakdown: [
        { bank: "SBI", amount: 100000, rate: "6.75%", maturity: "Mar 2026", currentValue: 106750 },
        { bank: "HDFC", amount: 75000, rate: "6.25%", maturity: "Jun 2025", currentValue: 78125 },
        { bank: "ICICI", amount: 25000, rate: "6.5%", maturity: "Sep 2025", currentValue: 26125 }
      ]
    },
    {
      id: 5,
      name: "EPFO",
      icon: "/piggy_darkblue_icon.svg",
      type: "EPFO",
      currentValue: 280000,
      originalInvestment: 258000,
      details: {
        monthlyContribution: 3500,
        employerContribution: 3500,
        interestRate: "8.1%",
        pfNumber: "KN/12345/0000123",
        yearsCompleted: 3.5
      },
      breakdown: [
        { year: "2024-25", employee: 42000, employer: 42000, interest: 6804, total: 90804 },
        { year: "2023-24", employee: 40000, employer: 40000, interest: 6480, total: 86480 },
        { year: "2022-23", employee: 36000, employer: 36000, interest: 5832, total: 77832 }
      ]
    },
    {
      id: 6,
      name: "Gold",
      icon: "/gold_icon.svg",
      type: "GOLD",
      currentValue: 185000,
      originalInvestment: 160000,
      details: {
        totalWeight: "250 grams",
        avgPurchasePrice: 6400,
        currentPrice: 7400,
        goldType: "24K",
        lastPurchase: "Nov 2024"
      },
      breakdown: [
        { type: "Gold Coins", weight: "100g", buyPrice: 6200, currentPrice: 7400, value: 74000 },
        { type: "Gold Jewelry", weight: "150g", buyPrice: 6500, currentPrice: 7400, value: 111000 }
      ]
    },
    {
      id: 7,
      name: "Property",
      icon: "/property_icon.svg",
      type: "PROPERTY",
      currentValue: 9500000,
      originalInvestment: 6500000,
      details: {
        totalProperties: 2,
        monthlyRental: 45000,
        avgAppreciation: "8.5%",
        totalArea: "2400 sq ft",
        lastValuation: "Jan 2025"
      },
      breakdown: [
        { 
          address: "Whitefield, Bangalore", 
          type: "2BHK Apartment", 
          buyPrice: 3500000, 
          currentValue: 5200000, 
          rental: 25000,
          area: "1200 sq ft"
        },
        { 
          address: "Electronic City, Bangalore", 
          type: "3BHK Villa", 
          buyPrice: 3000000, 
          currentValue: 4300000, 
          rental: 20000,
          area: "1200 sq ft"
        }
      ]
    },
  ];

  // Parked fund data with enhanced details
  const parkedFunds = [
    {
      id: 1,
      name: "Government Bonds",
      icon: "/wallet_darkblue_icon.svg",
      amount: 100000,
      type: "Savings",
      interestRate: "7.15%",
      maturity: "2030",
      risk: "Very Low"
    },
    {
      id: 2,
      name: "Liquid Funds",
      icon: "/piggy_darkblue_icon.svg",
      amount: 50000,
      type: "Goals",
      returns: "4.2%",
      withdrawalTime: "24 hours",
      risk: "Low"
    },
  ];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DetailedInvestmentCard = ({ investment }: { investment: any }) => {
    const isExpanded = expandedCard === investment.id;
    const profitLoss = calculateProfitLoss(investment.currentValue, investment.originalInvestment);
  
    const handleToggleExpansion = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent any default button behavior
      e.stopPropagation(); // Stop event bubbling
      toggleCardExpansion(investment.id);
    };
  
    return (
      <Card className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Image
                src={investment.icon}
                alt={investment.name}
                className="mr-3"
                width={24}
                height={24}
              />
              <div>
                <h3 className="font-medium text-lg text-gray-800">
                  {investment.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {investment.details.totalStocks && `${investment.details.totalStocks} Holdings`}
                  {investment.details.totalFunds && `${investment.details.totalFunds} Funds`}
                  {investment.details.totalVentures && `${investment.details.totalVentures} Ventures`}
                  {investment.details.totalFDs && `${investment.details.totalFDs} Deposits`}
                  {investment.details.totalProperties && `${investment.details.totalProperties} Properties`}
                  {investment.details.totalWeight && investment.details.totalWeight}
                  {investment.details.pfNumber && 'EPF Account'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-xl text-blue-600">
                {formatCurrency(investment.currentValue)}
              </p>
              <div className="flex items-center justify-end mt-1">
                {profitLoss.isProfit ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${profitLoss.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                  {profitLoss.isProfit ? '+' : ''}{profitLoss.percentage}%
                </span>
              </div>
            </div>
          </div>
  
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Invested</p>
              <p className="font-semibold text-gray-700">
                {formatCurrency(investment.originalInvestment)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Current Value</p>
              <p className="font-semibold text-blue-600">
                {formatCurrency(investment.currentValue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Profit/Loss</p>
              <p className={`font-semibold ${profitLoss.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {profitLoss.isProfit ? '+' : ''}{formatCurrency(profitLoss.difference)}
              </p>
            </div>
          </div>
  
          {/* Quick Info */}
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <Info className="w-4 h-4 mr-1" />
              {investment.details.lastUpdated || 'Updated today'}
            </span>
            {/* FIXED: Added type="button", preventDefault, and proper event handling */}
            <Button
              type="button" // Explicitly set button type
              size="sm"
              onClick={handleToggleExpansion}
              className="text-white"
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
            </Button>
          </div>
  
          {/* Rest of your component remains the same */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              {/* Investment Specific Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {investment.type === 'STOCK' && (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Top Performer</p>
                      <p className="font-semibold text-gray-800">{investment.details.topPerformer}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Dividends Received</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(investment.details.dividend)}</p>
                    </div>
                  </>
                )}
  
                {investment.type === 'MUTUAL_FUND' && (
                  <>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-purple-600 mb-1">Monthly SIP</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(investment.details.sipAmount)}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-xs text-indigo-600 mb-1">Best Performer</p>
                      <p className="font-semibold text-gray-800">{investment.details.bestPerformer}</p>
                    </div>
                  </>
                )}
  
                {investment.type === 'BUSINESS' && (
                  <>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-orange-600 mb-1">Monthly Income</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(investment.details.monthlyIncome)}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-yellow-600 mb-1">Ownership</p>
                      <p className="font-semibold text-gray-800">{investment.details.ownership}</p>
                    </div>
                  </>
                )}
  
                {investment.type === 'EPFO' && (
                  <>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-xs text-teal-600 mb-1">Monthly Contribution</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(investment.details.monthlyContribution)}</p>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <p className="text-xs text-cyan-600 mb-1">Interest Rate</p>
                      <p className="font-semibold text-gray-800">{investment.details.interestRate}</p>
                    </div>
                  </>
                )}
  
                {investment.type === 'PROPERTY' && (
                  <>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-xs text-emerald-600 mb-1">Monthly Rental</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(investment.details.monthlyRental)}</p>
                    </div>
                    <div className="bg-lime-50 p-3 rounded-lg">
                      <p className="text-xs text-lime-600 mb-1">Total Area</p>
                      <p className="font-semibold text-gray-800">{investment.details.totalArea}</p>
                    </div>
                  </>
                )}
              </div>
  
              {/* Holdings/Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Coins className="w-4 h-4 mr-2" />
                  Holdings Breakdown
                </h4>
                <div className="space-y-3">
                  {investment.breakdown?.slice(0, 3).map((item: { name: string; type: string; bank: string; address: string; shares: number; currentPrice: number; units: number; nav: number; rate: number; maturity: string; area: string; rental: number; weight: number; value: number; currentValue: number; buyPrice: number; }, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {item.name || item.type || item.bank || item.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {investment.type === 'STOCK' && `${item.shares} shares • ₹${item.currentPrice} each`}
                          {investment.type === 'MUTUAL_FUND' && `${item.units} units • NAV: ₹${item.nav}`}
                          {investment.type === 'FIXED_DEPOSIT' && `${item.rate} interest • Matures: ${item.maturity}`}
                          {investment.type === 'PROPERTY' && `${item.type} • ${item.area} • Rent: ₹${item.rental}/month`}
                          {investment.type === 'GOLD' && `${item.weight} • ₹${item.currentPrice}/gram`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600 text-sm">
                          {formatCurrency(item.value || item.currentValue)}
                        </p>
                        {item.buyPrice && item.currentPrice && (
                          <p className={`text-xs ${item.currentPrice > item.buyPrice ? 'text-green-600' : 'text-red-600'}`}>
                            {item.currentPrice > item.buyPrice ? '+' : ''}
                            {(((item.currentPrice - item.buyPrice) / item.buyPrice) * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-8 max-w-[1187px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />
            
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex gap-4">
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200 flex items-center gap-2 h-[42px] px-5 rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={handleOpenModal}
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 gap-6 mb-8 mt-8">
        <Card className="bg-[#004a7c] text-white border-none rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-normal text-lg mb-4">
              Total Invested Amuount
            </h2>
            <p className="font-normal text-3xl mb-4">
              ₹ {totalInvestedAmount || 0}
            </p>
            <div className="flex items-center">
              <Image src="/growth_blue_icon.svg" alt="Trend" className="mr-2" width={16} height={16} />\
              <h3 className="font-normal text-lg mb-4">Current Value</h3>
              <span className="font-normal text-base text-[#00a9e0]">
                +12.5% this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00a9e0] text-white border-none rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-normal text-lg mb-4">
              Total Returns
            </h2>
            <p className="font-normal text-3xl mb-4">
              ₹ 24,94,000
            </p>
            <div className="flex items-center">
              <Image src="/growthchart_white_icon.svg" alt="Trend" className="mr-2" width={16} height={16} />
              <span className="font-normal text-base">
                +26.3% overall returns
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Investment Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {investmentCategories.slice(0, 6).map((investment) => (
          <DetailedInvestmentCard key={investment.id} investment={investment} />
        ))}
      </section>

      {/* Property Card (Full Width) */}
      <section className="mb-8">
        <DetailedInvestmentCard investment={investmentCategories[6]} />
      </section>

      {/* Parked Fund Section */}
      <section>
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
            <CardTitle className="font-normal text-xl text-[#004a7c]">
              Parked Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            {parkedFunds.map((fund) => (
              <div
                key={fund.id}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <Image
                    src={fund.icon}
                    alt={fund.name}
                    className="mr-3"
                    height={20}
                    width={20}
                  />
                  <div>
                    <p className="font-medium text-base text-gray-800">
                      {fund.name}
                    </p>
                    <p className="font-normal text-sm text-gray-500">
                      {fund.type} • {fund.interestRate || fund.returns} • Risk: {fund.risk}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(fund.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fund.maturity && `Matures: ${fund.maturity}`}
                    {fund.withdrawalTime && `Withdraw: ${fund.withdrawalTime}`}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Investment Input Modal */}
      <InvestmentInputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveInvestment={handleSaveInvestment}
      />
    </div>
  );
};

export default InvestmentManagementBody;
