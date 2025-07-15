import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Link from 'next/link';
import useTransactionStore from "@/stores/transaction/transactionStore";
import { useRouter } from 'next/navigation';
import useDebtStore from "@/stores/debt/debtStore";
import useInvestmentStore from "@/stores/investment/investmentStore";
import { useInsuranceStore } from "@/stores/insurances/insuranceStore";
import { useGoalStore } from "@/stores/goals/goalStore";

const InsightsSection = function () {
  const [goalPercentage, setGoalPercentage] = useState(0);
  const [filledGoal, setFilledGoal] = useState(0);
  const [debtPercentage, setDebtPercentage] = useState(0);
  const [leftToPay, setLeftToPay] = useState(0);
  const [profitLossPercentage, setProfitLossPercentage] = useState(0);

  const router = useRouter();

  const handleInflowTabClick = function () {
    router.push('/income-analysis');
  }; 
  const handleOutflowTabClick = function () {
    router.push('/expense-analysis');
  };
  const handleGoalTabClick = function () {
    router.push('/goal-management');
  };
  const handleDebtTabClick = function () {
    router.push('/debt-analysis');
  };
  const handleInvestmentTabClick = function () {
    router.push('/investments');
  };
  const handleInsuranceTabClick = function () {
    router.push('/insurances');
  };
  const transactionsByCategory = useTransactionStore((state) => state.allIncomeTransactions);
  const outflowTransactionByCategory = useTransactionStore((state) => state.allExpenseTransactions);
  const totalActiveGoalAmount = useGoalStore((state) => state.totalActiveGoalAmount);
  const totalInitialGoalAmount = useGoalStore((state) => state.totalInitialGoalAmount);
  const totalDebt = useDebtStore((state) => state.totalDebt);
  const totalOutstandingDebtAmount = useDebtStore((state) => state.totalOutstandingDebtAmount);
  const totalInvestedAmount = useInvestmentStore((state) => state.totalInvestedAmount);
  const currentValue = useInvestmentStore((state) => state.totalCurrentValue);
  const totalReturns = useInvestmentStore((state) => state.totalCurrentValue);
  const totalInsuranceCoverage = useInsuranceStore((state) => state.totalInsuranceCoverage);
  const totalAnnualPremium = useInsuranceStore((state) => state.totalAnnualInsurancePremium);
  const upcomingPaymentDate = useInsuranceStore((state) => state.insuranceWithClosestNextPaymentDate);
  const fetchMonthlyTotalIncome = useTransactionStore((state) => state.fetchMonthlyTotalIncome);
  const fetchAllIncomeTransactons = useTransactionStore((state) => state.fetchAllIncomeTransactions);
  const fetchAllExpenseTransactons = useTransactionStore((state) => state.fetchAllExpenseTransactions);
  const fetchTotalInvestedAmount = useInvestmentStore((state) => state.fetchTotalInvestedAmount);
  const fetchCurrentValue = useInvestmentStore((state) => state.fetchCurrentValue);
  const fetchTotalReturns = useInvestmentStore((state) => state.fetchTotalReturns);
  const fetchTotalInsuranceCoverage = useInsuranceStore((state) => state.fetchTotalInsuranceCoverage);
  const fetchTotalAnnualPremium = useInsuranceStore((state) => state.fetchTotalAnnualInsurancePremium);
  const fetchUpcomingPaymentDate = useInsuranceStore((state) => state.fetchInsuranceWithClosestNextPaymentDate);

  // Separated the store fetching from calculations to prevent loops
  useEffect(() => {
    fetchMonthlyTotalIncome();
    fetchAllIncomeTransactons();
    fetchAllExpenseTransactons();
    fetchTotalInvestedAmount();
    fetchCurrentValue();
    fetchTotalReturns();
    fetchTotalInsuranceCoverage();
    fetchTotalAnnualPremium();
    fetchUpcomingPaymentDate();
  }, [
    fetchMonthlyTotalIncome,
    fetchAllIncomeTransactons, 
    fetchAllExpenseTransactons,
    fetchTotalInvestedAmount,
    fetchCurrentValue,
    fetchTotalReturns,
    fetchTotalInsuranceCoverage,
    fetchTotalAnnualPremium,
    fetchUpcomingPaymentDate,
  ]);

  const goalData = useCallback(function() {
    if (!totalInitialGoalAmount || !totalActiveGoalAmount) {
      setGoalPercentage(0);
      setFilledGoal(0);
      return;
    }

    // Calculate how much has been achieved
    const achievedAmount = totalInitialGoalAmount - totalActiveGoalAmount;

    // Calculate percentage of goal completed
    const percentage = (achievedAmount / totalInitialGoalAmount) * 100;

    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setGoalPercentage(clampedPercentage);
    setFilledGoal(achievedAmount);
  }, [totalActiveGoalAmount, totalInitialGoalAmount]);

  const debtData = useCallback(function() {
    if (!totalDebt || !totalOutstandingDebtAmount) {
      setDebtPercentage(0);
      setLeftToPay(0);
      return;
    }

    // Calculate how much has been left to pay
    const leftToPay = totalOutstandingDebtAmount;

    // Calculate percentage of goal completed
    const percentage = 100 - ((totalDebt / leftToPay) * 100);

    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setDebtPercentage(clampedPercentage);
    setLeftToPay(leftToPay);
  }, [totalDebt, totalOutstandingDebtAmount]);

  const investmentData = useCallback(function() {
    if (!totalInvestedAmount || !currentValue || !totalReturns) {
      setProfitLossPercentage(0);
      return;
    }

    const profitLossPercentage = currentValue - totalInvestedAmount;

    // Calculate percentage of investment completed
    const percentage = ((profitLossPercentage / totalInvestedAmount) * 100);

    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setProfitLossPercentage(clampedPercentage);
  }, [totalInvestedAmount, currentValue, totalReturns]);

  useEffect(() => {
    goalData();
    debtData();
    investmentData();
  },[goalData, debtData, investmentData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to format date consistently
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      // Use consistent formatting that works on both server and client
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.log((error as Error).message);
      return '';
    }
  };

  // Annually Categorywise Section
  const totalAmount = transactionsByCategory.reduce((sum, t) => sum += t.total, 0);

  // Calculate percentages and create transactionByCategory
  const incomeSourcesData = transactionsByCategory.map((transaction) => {
    const percentage = Math.round((transaction.total / totalAmount) * 100);
    
    type CategoryType =
      'INVESTMENTS' |
      'MISCELLANEOUS' |
      'SAVINGS' |
      'SALARY' |
      'FREELANCE' |
      'BUSINESS_INCOME' |
      'INVESTMENT_RETURN' |
      'DIVIDEND' |
      'INTEREST' |
      'RENTAL_INCOME' |
      'GIFT_RECEIVED' |
      'BONUS' |
      'GOVERNMENT_BENEFIT' |
      'REFUND' |
      'OTHER_INCOME' |
      'REGULAR' |
      'TRANSFER' |
      'PAYMENT' |
      'ADJUSTMENT' |
      'DEPOSIT' |
      'REWARD' |
      'CASHBACK' |
      'REDEMPTION';
    
    // Define colors and icons for each category
    const categoryStyles: Record<CategoryType, { color: string; icon: string }> = {
      'INVESTMENTS': { color: 'bg-blue-500', icon: '📈' },
      'MISCELLANEOUS': { color: 'bg-gray-500', icon: '🔗' },
      'SAVINGS': { color: 'bg-green-500', icon: '💰' },
      'SALARY': { color: 'bg-green-500', icon: '💼' },
      'FREELANCE': { color: 'bg-indigo-500', icon: '💻' },
      'BUSINESS_INCOME': { color: 'bg-purple-500', icon: '🏢' },
      'INVESTMENT_RETURN': { color: 'bg-blue-500', icon: '📈' },
      'DIVIDEND': { color: 'bg-teal-500', icon: '🧮' },
      'INTEREST': { color: 'bg-cyan-500', icon: '💹' },
      'RENTAL_INCOME': { color: 'bg-yellow-600', icon: '🏠' },
      'GIFT_RECEIVED': { color: 'bg-pink-500', icon: '🎁' },
      'BONUS': { color: 'bg-orange-500', icon: '🎉' },
      'GOVERNMENT_BENEFIT': { color: 'bg-gray-600', icon: '🏛️' },
      'REFUND': { color: 'bg-red-400', icon: '↩️' },
      'OTHER_INCOME': { color: 'bg-gray-400', icon: '📊' },
      'REGULAR': { color: 'bg-blue-500', icon: '📄' },
      'TRANSFER': { color: 'bg-blue-500', icon: '🔁' },
      'PAYMENT': { color: 'bg-blue-500', icon: '💳' },
      'ADJUSTMENT': { color: 'bg-blue-500', icon: '🔧' },
      'DEPOSIT': { color: 'bg-blue-500', icon: '📥' },
      'REWARD': { color: 'bg-blue-500', icon: '🏅' },
      'CASHBACK': { color: 'bg-blue-500', icon: '💵' },
      'REDEMPTION': { color: 'bg-blue-500', icon: '🎟️' },
    };
    
    return {
      name: transaction.category.charAt(0) + transaction.category.slice(1).toLowerCase(),
      amount: transaction.total,
      percentage,
      icon: categoryStyles[transaction.category as CategoryType]?.icon || '📊',
      color: 'bg-gray-400',
    };
  });

  const expenseSourcesData = outflowTransactionByCategory.map((transaction) => {
    const percentage = Math.round((transaction.total / totalAmount) * 100);
    
    type CategoryType =
      'INVESTMENTS' |
      'MISCELLANEOUS' |
      'SAVINGS' |
      'SALARY' |
      'FREELANCE' |
      'BUSINESS_INCOME' |
      'INVESTMENT_RETURN' |
      'DIVIDEND' |
      'INTEREST' |
      'RENTAL_INCOME' |
      'GIFT_RECEIVED' |
      'BONUS' |
      'GOVERNMENT_BENEFIT' |
      'REFUND' |
      'OTHER_INCOME' |
      'REGULAR' |
      'TRANSFER' |
      'PAYMENT' |
      'ADJUSTMENT' |
      'DEPOSIT' |
      'REWARD' |
      'CASHBACK' |
      'REDEMPTION';
    
    // Define colors and icons for each category
    const categoryStyles: Record<CategoryType, { color: string; icon: string }> = {
      'INVESTMENTS': { color: 'bg-blue-500', icon: '📈' },
      'MISCELLANEOUS': { color: 'bg-gray-500', icon: '🔗' },
      'SAVINGS': { color: 'bg-green-500', icon: '💰' },
      'SALARY': { color: 'bg-green-500', icon: '💼' },
      'FREELANCE': { color: 'bg-indigo-500', icon: '💻' },
      'BUSINESS_INCOME': { color: 'bg-purple-500', icon: '🏢' },
      'INVESTMENT_RETURN': { color: 'bg-blue-500', icon: '📈' },
      'DIVIDEND': { color: 'bg-teal-500', icon: '🧮' },
      'INTEREST': { color: 'bg-cyan-500', icon: '💹' },
      'RENTAL_INCOME': { color: 'bg-yellow-600', icon: '🏠' },
      'GIFT_RECEIVED': { color: 'bg-pink-500', icon: '🎁' },
      'BONUS': { color: 'bg-orange-500', icon: '🎉' },
      'GOVERNMENT_BENEFIT': { color: 'bg-gray-600', icon: '🏛️' },
      'REFUND': { color: 'bg-red-400', icon: '↩️' },
      'OTHER_INCOME': { color: 'bg-gray-400', icon: '📊' },
      'REGULAR': { color: 'bg-blue-500', icon: '📄' },
      'TRANSFER': { color: 'bg-blue-500', icon: '🔁' },
      'PAYMENT': { color: 'bg-blue-500', icon: '💳' },
      'ADJUSTMENT': { color: 'bg-blue-500', icon: '🔧' },
      'DEPOSIT': { color: 'bg-blue-500', icon: '📥' },
      'REWARD': { color: 'bg-blue-500', icon: '🏅' },
      'CASHBACK': { color: 'bg-blue-500', icon: '💵' },
      'REDEMPTION': { color: 'bg-blue-500', icon: '🎟️' },
    };
    
    return {
      name: transaction.category.charAt(0) + transaction.category.slice(1).toLowerCase(),
      amount: transaction.total,
      percentage,
      icon: categoryStyles[transaction.category as CategoryType]?.icon || '📊',
      color: 'bg-gray-400',
    };
  });

  return (
    <section className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Card */}
        <Card className="shadow-md rounded-xl cursor-pointer" onClick={handleInflowTabClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Inflow Overview 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {incomeSourcesData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{source.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${source.color}`}
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{source.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(source.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debt Overview Card */}
        <Card className="shadow-md rounded-xl cursor-pointer" onClick={handleOutflowTabClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Outflow Overview 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {expenseSourcesData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{source.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${source.color}`}
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{source.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(source.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Goal Progress Card */}
        <Card className="shadow-md rounded-xl cursor-pointer" onClick={handleGoalTabClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Goal Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-8">
                {/* Background Circle */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#00a9e0"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - goalPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-normal [font-family:'Poppins',Helvetica]">
                      {goalPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                      Goal Progress
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Achieved: {formatCurrency(filledGoal)}</span>
                  <span>Target: {formatCurrency(totalInitialGoalAmount)}</span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-[#00a9e0] rounded-full transition-all duration-300" 
                    style={{ width: `${goalPercentage}%` }}
                  />
                </div>
                <div className="text-center text-xs text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                  Remaining: {formatCurrency(totalActiveGoalAmount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Fund Progress Card */}
        <Card className="shadow-md rounded-xl cursor-pointer" onClick={handleInvestmentTabClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Investment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-8">
                {/* Background Circle */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={profitLossPercentage >= 0 ? "#10b981" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.abs(profitLossPercentage) / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-normal [font-family:'Poppins',Helvetica] ${
                      profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                      {profitLossPercentage >= 0 ? 'Profit' : 'Loss'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Invested Amount:</span>
                  <span className="font-medium">{formatCurrency(totalInvestedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Current Valuation:</span>
                  <span className="font-medium">{formatCurrency(currentValue)}</span>
                </div>
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Profit/Loss:</span>
                  <span className={`font-medium ${
                    totalReturns >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns - totalInvestedAmount)}
                  </span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      profitLossPercentage >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(Math.abs(profitLossPercentage), 100)}%` }}
                  />
                </div>
                <div className="text-center text-xs text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                  Return: {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Overview Card */}
        <Card className="shadow-md rounded-xl cursor-pointer" onClick={handleDebtTabClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Debt Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-8">
                {/* Background Circle */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#00a9e0"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - debtPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-normal [font-family:'Poppins',Helvetica]">
                      {debtPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                      Debt Progress
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Left To Pay: {formatCurrency(leftToPay)}</span>
                  <span>Target: {formatCurrency(totalDebt)}</span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-[#00a9e0] rounded-full transition-all duration-300" 
                    style={{ width: `${debtPercentage}%` }}
                  />
                </div>
                <div className="text-center text-xs text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                  Remaining: {formatCurrency(leftToPay)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Overview */}
        <Card className="shadow-md rounded-xl cursor-pointer" onClick={handleInsuranceTabClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica] text-[#004a7c]">
              Insurance Overview 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica] mb-2">
                      Total Coverage
                    </div>
                    <div className="text-2xl font-medium [font-family:'Poppins',Helvetica]">
                      {formatCurrency(totalInsuranceCoverage)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica] mb-2">
                      Total Premium Paid
                    </div>
                    <div className="text-2xl font-medium [font-family:'Poppins',Helvetica]">
                     {formatCurrency(totalAnnualPremium)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica] mb-2">
                      Next Payment
                    </div>
                    <div className="text-2xl font-medium [font-family:'Poppins',Helvetica]">
                      {upcomingPaymentDate?.next_payment_date ? formatDate(upcomingPaymentDate.next_payment_date) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Behavior Score Section */}
      <Link href={'/spending-behavior-score-details'} passHref >
      <Card className="mt-6 shadow-[0px_1px_2px_#0000000d] rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-normal [font-family:'Poppins',Helvetica] text-[#004a7c]">
            Spending Behavior Score
          </CardTitle>
          <p className="text-base font-normal [font-family:'Poppins',Helvetica] text-gray-600">
            Understand your financial personality based on your spending
            patterns
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="text-base font-normal [font-family:'Poppins',Helvetica] text-amber-700">
              10-14 Points: Good Progress
            </h3>
            <p className="text-base font-normal [font-family:'Poppins',Helvetica] text-gray-700 mt-2">
              You&apos;re on the right track with balanced financial habits. Continue
              to build your emergency fund and work on increasing your savings
              rate.
            </p>
          </div>
        </CardContent>
        </Card>
        </Link>
    </section>
  );
};

export default InsightsSection;
