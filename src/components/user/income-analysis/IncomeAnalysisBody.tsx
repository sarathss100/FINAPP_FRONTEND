"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp, Calendar, PieChart, BarChart3, IndianRupee, TrendingDown } from 'lucide-react';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import useTransactionStore from '@/stores/transaction/transactionStore';
import InflowTableComponent from './InflowTable';

const IncomeAnalysisDashboard = () => {
  const [incomePercentage, setIncomePercentage] = useState(0);
  const [aveageDailyIncome, setAverageDailyIncome] = useState(0);
  const [aveageWeeklyIncome, setAverageWeeklyIncome] = useState(0);
  const [maxMonthlyIncome, setMaxMonthlyIncome] = useState(0);
  const currentMonthTotalIncome = useTransactionStore((state) => state.currentMonthTotalIncome);
  const previousMonthTotalIncome = useTransactionStore((state) => state.previousMonthTotalIncome);
  const monthlyIncomeTrends = useTransactionStore((state) => state.monthlyIncomeTrends);
  const transactionsByCategory = useTransactionStore((state) => state.allIncomeTransactions);
  const fetchMonthlyTotalIncome = useTransactionStore((state) => state.fetchMonthlyTotalIncome);
  const fetchMonthlyIncomeTrends = useTransactionStore((state) => state.fetchMonthlyIncomeTrends);
  const fetchAllIncomeTransactons = useTransactionStore((state) => state.fetchAllIncomeTransactions);

  const getDaysInMonth = function (date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Fixed percentage calculation
  const calculatePercentage = useCallback(function () {
    if (previousMonthTotalIncome === 0) {
      setIncomePercentage(currentMonthTotalIncome > 0 ? 100 : 0);
    } else {
      const percentage = ((currentMonthTotalIncome - previousMonthTotalIncome) / previousMonthTotalIncome) * 100;
      setIncomePercentage(isNaN(percentage) ? 0 : percentage);
    }
  }, [currentMonthTotalIncome, previousMonthTotalIncome]);

  const calculateAverage = useCallback(function () {
    const daysInMonth = getDaysInMonth(new Date());
    const dailyAverage = currentMonthTotalIncome / daysInMonth;
    const weeklyAverage = dailyAverage * 7;
    setAverageDailyIncome(isNaN(dailyAverage) ? 0 : dailyAverage);
    setAverageWeeklyIncome(isNaN(weeklyAverage) ? 0 : weeklyAverage);
  }, [currentMonthTotalIncome]);

  const calcMaxMonthlyIncome = useCallback(function () {
    if (monthlyIncomeTrends && monthlyIncomeTrends.length > 0) {
      const maxIncome = Math.max(...monthlyIncomeTrends.map(m => m.amount || 0));
      setMaxMonthlyIncome(isNaN(maxIncome) ? 0 : maxIncome);
    } else {
      setMaxMonthlyIncome(0);
    }
  }, [monthlyIncomeTrends]);
  
  // Separated the store fetching from calculations to prevent loops
  useEffect(() => {
    fetchMonthlyTotalIncome();
    fetchMonthlyIncomeTrends();
    fetchAllIncomeTransactons();
    // fetchDataForInflowTable();
  }, [fetchMonthlyTotalIncome, fetchMonthlyIncomeTrends, fetchAllIncomeTransactons]);

  // Separate effect for calculations that depend on the fetched data
  useEffect(() => {
    calculatePercentage();
    calculateAverage();
    calcMaxMonthlyIncome();
  }, [calculatePercentage, calculateAverage, calcMaxMonthlyIncome]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with search and profile */}
        <UserHeader />

        {/* Page title */}
        <PageTitle title={`Inflow Analysis`} tag={`Track and analyze your inflow streams`} />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <IndianRupee className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center ${incomePercentage > 0 ? 'text-green-500' : incomePercentage < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {incomePercentage > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ): incomePercentage < 0 ? (
                    <TrendingDown className="w-4 h-4 mr-1" /> 
                  ) : null
                }
                <span className="text-sm font-medium">
                  {incomePercentage > 0 ? '+' : incomePercentage < 0 ? '-' : ''}
                  {Math.abs(incomePercentage).toFixed(2)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonthTotalIncome || 0)}</h3>
            <p className="text-gray-600 text-sm">Total Monthly Inflow</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(aveageDailyIncome)}</h3>
            <p className="text-gray-600 text-sm">Average Daily Inflow</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(aveageWeeklyIncome)}</h3>
            <p className="text-gray-600 text-sm">Average Weekly Inflow</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <PieChart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{incomeSourcesData.length}</h3>
            <p className="text-gray-600 text-sm">Active Inflow Sources</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Left Column - Income Sources & Trends */}
          <div className="lg:col-span-2 space-y-8">
            {/* Income Sources Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Inflow Sources Distribution Annually</h2>
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

            {/* Monthly Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Inflow Trends</h2>
              <div className="h-64 flex items-end justify-between gap-4">
                {monthlyIncomeTrends && monthlyIncomeTrends.length > 0 ? monthlyIncomeTrends.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full max-w-12 relative">
                      <div
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mb-1 transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                        style={{ height: `${maxMonthlyIncome > 0 ? (month.amount / maxMonthlyIncome) * 200 : 0}px` }}
                      />
                      <div className="text-xs font-medium text-center text-gray-600">{month.month}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{formatCurrency(month.amount || 0)}</div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 w-full">No data available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <InflowTableComponent />
      </div>
    </div>
  );
};

export default IncomeAnalysisDashboard;
