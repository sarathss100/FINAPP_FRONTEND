"use client"
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import UserHeader from '../base/Header';
import Image from 'next/image';
import { PlusCircleIcon, TrendingUp, TrendingDown, Coins, Info, Trash2 } from 'lucide-react';
import InvestmentInputModal from './InvestmentInputModal';
import { createInvestment, removeInvestment } from '@/service/investmentService';
import { toast } from 'react-toastify';
import { Investments, InvestmentType } from '@/types/IInvestments';
import useInvestmentStore from "@/stores/investment/investmentStore";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  investmentName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-black mb-3">
                Delete Investment
              </h3>
              <p className="text-black leading-relaxed">
                Are you sure you want to delete this Investment? This action cannot be undone and all associated data will be permanently removed.
              </p>
            </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-green-300 focus:ring-offset-2 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-red-300 focus:ring-offset-2 shadow-lg hover:shadow-xl order-1 sm:order-2"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const InvestmentManagementBody = function () {
  const totalInvestedAmount = useInvestmentStore((state) => state.totalInvestedAmount);
  const currentValue = useInvestmentStore((state) => state.totalCurrentValue);
  const totalReturns = useInvestmentStore((state) => state.totalCurrentValue);
  const categorizedInvestments = useInvestmentStore((state) => state.investments);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [investmentToDelete, setInvestmentToDelete] = React.useState<{
    id: string;
    name: string;
    type: InvestmentType;
  } | null>(null);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleCardExpansion = (type: string) => {
    setExpandedCard(expandedCard === type ? null : type);
  };

  const handleDeleteInvestment = async (investmentId: string, investmentType: InvestmentType) => {
    try {
      // Replace this with your actual delete service call
      const response = await removeInvestment(investmentType, investmentId);
      if (response.success) {
        toast.success('Investment deleted successfully!');
      }
    } catch (error) {
      console.error((error as Error).message || 'Failed to delete investment');
    } finally {
      setDeleteModalOpen(false);
      setInvestmentToDelete(null);
    }
  };

  const openDeleteModal = (investment: Investments, type: InvestmentType) => {
    setInvestmentToDelete({
      id: investment._id || '',
      name: investment.name,
      type: type
    });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setInvestmentToDelete(null);
  };

  const confirmDelete = () => {
    if (investmentToDelete) {
      handleDeleteInvestment(investmentToDelete.id, investmentToDelete.type);
    }
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

  // Helper function to get investment type display info
  const getInvestmentTypeInfo = (type: InvestmentType) => {
    const typeMap = {
      [InvestmentType.STOCK]: {
        name: "Direct Stocks",
        icon: "/investment_icon.svg"
      },
      [InvestmentType.MUTUAL_FUND]: {
        name: "Mutual Funds",
        icon: "/mutualfund_icon.svg"
      },
      [InvestmentType.BOND]: {
        name: "Bonds",
        icon: "/wallet_darkblue_icon.svg"
      },
      [InvestmentType.PROPERTY]: {
        name: "Property",
        icon: "/property_icon.svg"
      },
      [InvestmentType.BUSINESS]: {
        name: "Business",
        icon: "/business_icon.svg"
      },
      [InvestmentType.FIXED_DEPOSIT]: {
        name: "Fixed Deposits",
        icon: "/fixeddeposit_icon.svg"
      },
      [InvestmentType.EPFO]: {
        name: "EPFO",
        icon: "/piggy_darkblue_icon.svg"
      },
      [InvestmentType.GOLD]: {
        name: "Gold",
        icon: "/gold_icon.svg"
      },
      [InvestmentType.PARKING_FUND]: {
        name: "Parking Fund",
        icon: "/wallet_darkblue_icon.svg"
      }
    };
    return typeMap[type] || { name: type, icon: "/investment_icon.svg" };
  };

  // Process categorized investments for display
  const processInvestmentCategories = () => {
    if (!categorizedInvestments) return [];

    return Object.entries(categorizedInvestments).map(([type, investments]) => {
      const investmentType = type as InvestmentType;
      const typeInfo = getInvestmentTypeInfo(investmentType);
      
      // Calculate totals for this category
      const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.initialAmount), 0);
      const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
      const totalCount = investments.length;

      return {
        type: investmentType,
        name: typeInfo.name,
        icon: typeInfo.icon,
        currentValue: totalCurrentValue,
        originalInvestment: totalInvested,
        count: totalCount,
        investments: investments,
        details: getTypeSpecificDetails(investmentType, investments)
      };
    }).filter(category => category.investments.length > 0);
  };

  // Get type-specific details for each investment category
  const getTypeSpecificDetails = (type: InvestmentType, investments: Investments[]) => {
    switch (type) {
      case InvestmentType.STOCK:
        const stockInvestments = investments.filter(inv => inv.type === InvestmentType.STOCK);
        const totalDividends = stockInvestments.reduce((sum, stock) => sum + (stock.dividendsReceived || 0), 0);
        const topStock = stockInvestments.length > 0
          ? stockInvestments.reduce((prev, current) =>
              (current.currentValue || current.initialAmount) > (prev.currentValue || prev.initialAmount) ? current : prev
            )
          : undefined;
        return {
          totalStocks: stockInvestments.length,
          topPerformer: topStock && 'name' in topStock ? topStock.name : 'N/A',
          dividend: totalDividends,
          lastUpdated: "Today"
        };

      case InvestmentType.MUTUAL_FUND:
        const mfInvestments = investments.filter(inv => inv.type === InvestmentType.MUTUAL_FUND);
        const bestMF = mfInvestments.length > 0
          ? mfInvestments.reduce((prev, current) => {
              const prevReturn = ((prev.currentValue || prev.initialAmount) - prev.initialAmount) / prev.initialAmount;
              const currentReturn = ((current.currentValue || current.initialAmount) - current.initialAmount) / current.initialAmount;
              return currentReturn > prevReturn ? current : prev;
            })
          : undefined;
        return {
          totalFunds: mfInvestments.length,
          bestPerformer: bestMF ? bestMF.name : 'N/A',
          lastUpdated: "Today"
        };

      case InvestmentType.BUSINESS:
        const businessInvestments = investments.filter(inv => inv.type === InvestmentType.BUSINESS);
        const totalMonthlyReturn = businessInvestments.reduce((sum, business) => sum + (business.annualReturn || 0), 0) / 12;
        return {
          totalVentures: businessInvestments.length,
          monthlyIncome: totalMonthlyReturn,
          lastUpdated: "Today"
        };

      case InvestmentType.FIXED_DEPOSIT:
        const fdInvestments = investments.filter(inv => inv.type === InvestmentType.FIXED_DEPOSIT);
        const avgInterestRate = fdInvestments.reduce((sum, fd) => sum + fd.interestRate, 0) / fdInvestments.length;
        return {
          totalFDs: fdInvestments.length,
          avgInterestRate: `${avgInterestRate.toFixed(2)}%`,
          lastUpdated: "Today"
        };

      case InvestmentType.PROPERTY:
        const propertyInvestments = investments.filter(inv => inv.type === InvestmentType.PROPERTY);
        const totalRental = propertyInvestments.reduce((sum, prop) => sum + (prop.rentalIncome || 0), 0);
        return {
          totalProperties: propertyInvestments.length,
          monthlyRental: totalRental,
          lastUpdated: "Today"
        };

      case InvestmentType.EPFO:
        const epfoInvestments = investments.filter(inv => inv.type === InvestmentType.EPFO);
        const avgInterestRateEPFO = epfoInvestments.reduce((sum, epfo) => sum + epfo.interestRate, 0) / epfoInvestments.length;
        return {
          interestRate: `${avgInterestRateEPFO.toFixed(2)}%`,
          lastUpdated: "Today"
        };

      case InvestmentType.GOLD:
        const goldInvestments = investments.filter(inv => inv.type === InvestmentType.GOLD);
        const totalWeight = goldInvestments.reduce((sum, gold) => sum + gold.weight, 0);
        return {
          totalWeight: `${totalWeight}g`,
          lastUpdated: "Today"
        };

      default:
        return {
          lastUpdated: "Today"
        };
    }
  };

  const investmentCategories = processInvestmentCategories();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DetailedInvestmentCard = ({ category }: { category: any }) => {
    const isExpanded = expandedCard === category.type;
    const profitLoss = calculateProfitLoss(category.currentValue, category.originalInvestment);
  
    const handleToggleExpansion = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCardExpansion(category.type);
    };
  
    return (
      <Card className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Image
                src={category.icon}
                alt={category.name}
                className="mr-3"
                width={24}
                height={24}
              />
              <div>
                <h3 className="font-medium text-lg text-gray-800">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count} {category.count === 1 ? 'Investment' : 'Investments'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-xl text-blue-600">
                {formatCurrency(category.currentValue)}
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
                {formatCurrency(category.originalInvestment)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Current Value</p>
              <p className="font-semibold text-blue-600">
                {formatCurrency(category.currentValue)}
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
              {category.details.lastUpdated}
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleToggleExpansion}
              className="text-white"
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
            </Button>
          </div>
  
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              {/* Investment Specific Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {category.type === InvestmentType.STOCK && (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Top Performer</p>
                      <p className="font-semibold text-gray-800">{category.details.topPerformer}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Dividends Received</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(category.details.dividend)}</p>
                    </div>
                  </>
                )}
  
                {category.type === InvestmentType.MUTUAL_FUND && (
                  <>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-purple-600 mb-1">Total Funds</p>
                      <p className="font-semibold text-gray-800">{category.details.totalFunds}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-xs text-indigo-600 mb-1">Best Performer</p>
                      <p className="font-semibold text-gray-800">{category.details.bestPerformer}</p>
                    </div>
                  </>
                )}
  
                {category.type === InvestmentType.BUSINESS && (
                  <>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-orange-600 mb-1">Monthly Income</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(category.details.monthlyIncome)}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-yellow-600 mb-1">Total Ventures</p>
                      <p className="font-semibold text-gray-800">{category.details.totalVentures}</p>
                    </div>
                  </>
                )}
  
                {category.type === InvestmentType.EPFO && (
                  <>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-xs text-teal-600 mb-1">Interest Rate</p>
                      <p className="font-semibold text-gray-800">{category.details.interestRate}</p>
                    </div>
                  </>
                )}
  
                {category.type === InvestmentType.PROPERTY && (
                  <>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-xs text-emerald-600 mb-1">Monthly Rental</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(category.details.monthlyRental)}</p>
                    </div>
                    <div className="bg-lime-50 p-3 rounded-lg">
                      <p className="text-xs text-lime-600 mb-1">Total Properties</p>
                      <p className="font-semibold text-gray-800">{category.details.totalProperties}</p>
                    </div>
                  </>
                )}

                {category.type === InvestmentType.FIXED_DEPOSIT && (
                  <>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <p className="text-xs text-cyan-600 mb-1">Avg Interest Rate</p>
                      <p className="font-semibold text-gray-800">{category.details.avgInterestRate}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Total FDs</p>
                      <p className="font-semibold text-gray-800">{category.details.totalFDs}</p>
                    </div>
                  </>
                )}

                {category.type === InvestmentType.GOLD && (
                  <>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-yellow-600 mb-1">Total Weight</p>
                      <p className="font-semibold text-gray-800">{category.details.totalWeight}</p>
                    </div>
                  </>
                )}
              </div>
  
              {/* Holdings/Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Coins className="w-4 h-4 mr-2" />
                  Individual Investments
                </h4>
                <div className="space-y-3">
                  {category.investments.slice(0, 5).map((investment: Investments, index: number) => {
                    const investmentProfitLoss = calculateProfitLoss(
                      investment.currentValue || investment.initialAmount, 
                      investment.initialAmount
                    );
                    
                    return (
                      <div key={investment.name ? `${investment.name}-${index}` : index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {investment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {investment.type === InvestmentType.STOCK && 
                              `${investment.quantity} shares • ${investment.symbol}`}
                            {investment.type === InvestmentType.MUTUAL_FUND && 
                              `${investment.units} units • ${investment.schemeCode}`}
                            {investment.type === InvestmentType.FIXED_DEPOSIT && 
                              `${investment.interestRate}% • ${investment.bank}`}
                            {investment.type === InvestmentType.PROPERTY && 
                              `${investment.propertyType} • ${investment.address}`}
                            {investment.type === InvestmentType.BUSINESS && 
                              `${investment.ownershipPercentage}% • ${investment.businessName}`}
                            {investment.type === InvestmentType.EPFO && 
                              `${investment.epfNumber}`}
                            {investment.type === InvestmentType.GOLD && 
                              `${investment.weight}g • ${investment.goldType}`}
                            {investment.type === InvestmentType.BOND && 
                              `${investment.couponRate}% • ${investment.issuer}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-blue-600 text-sm">
                              {formatCurrency(investment.currentValue || investment.initialAmount)}
                            </p>
                            <p className={`text-xs ${investmentProfitLoss.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                              {investmentProfitLoss.isProfit ? '+' : ''}{investmentProfitLoss.percentage}%
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(investment, category.type)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete investment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {category.investments.length > 5 && (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500">
                        +{category.investments.length - 5} more investments
                      </p>
                    </div>
                  )}
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
              Total Invested Amount
            </h2>
            <p className="font-normal text-3xl mb-4">
              ₹ {totalInvestedAmount || 0}
            </p>
            <h3 className="font-normal text-lg mb-4">Current Valuation</h3>
            <p className="font-normal text-3xl mb-4">
              ₹ {currentValue.toFixed(2) || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#00a9e0] text-white border-none rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-normal text-lg mb-4">
              Total Returns
            </h2>
            <p className="font-normal text-3xl mb-4">
              ₹ {(totalReturns - totalInvestedAmount).toFixed(2) || 0}
            </p>
            <div className="flex items-center">
              <Image src="/growthchart_white_icon.svg" alt="Trend" className="mr-2" width={16} height={16} />
              <span className="font-normal text-base">
                {totalInvestedAmount > 0 ? ((totalReturns - totalInvestedAmount) * 100 / totalInvestedAmount).toFixed(2) : '0.00'}% overall returns
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Investment Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {investmentCategories.filter(cat => cat.type !== InvestmentType.PROPERTY).map((category) => (
          <DetailedInvestmentCard key={category.type} category={category} />
        ))}
      </section>

      {/* Property Card (Full Width) - only if exists */}
      {investmentCategories.find(cat => cat.type === InvestmentType.PROPERTY) && (
        <section className="mb-8">
          <DetailedInvestmentCard 
            category={investmentCategories.find(cat => cat.type === InvestmentType.PROPERTY)!} 
          />
        </section>
      )}

      {/* Show message if no investments */}
      {investmentCategories.length === 0 && (
        <section className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No investments found</p>
            <p className="text-sm">Start by adding your first investment</p>
          </div>
        </section>
      )}

      {/* Investment Input Modal */}
      <InvestmentInputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveInvestment={handleSaveInvestment}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        investmentName={investmentToDelete?.name || ''}
      />
    </div>
  );
};

export default InvestmentManagementBody;
