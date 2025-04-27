"use client";
import { PlusIcon, MoreVertical, TrendingUp, Clock, Wallet, Calendar } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Progress } from '@/components/base/progress';
import GoalInputModal from '../GoalInputModal';
import { useGoalStore } from '@/stores/store';

export const GoalManagementSection = function () {
  const [isGoalInputModalOpen, setIsGoalInputModalOpen] = useState(false);
  const totalActiveGoalAmount = useGoalStore((state) => state.totalActiveGoalAmount);
  const longestTimePeriod = useGoalStore((state) => state.longestTimePeriod);
  const smartAnalysis = useGoalStore((state) => state.smartAnalysis);
  const goalsByCategory = useGoalStore((state) => state.categoryByGoals);
  const fetchLongestTimePeriod = useGoalStore((state) => state.fetchLongestTimePeriod);
  const fetchTotalActiveGoalAmount = useGoalStore((state) => state.fetchTotalActiveGoalAmount);
  const fetchGoals = useGoalStore(state => state.fetchGoals);
  const analysisData = useGoalStore((state) => state.fetchSmartAnalysis);
  const fetchCategoryByGoals = useGoalStore((state) => state.fetchCategoryByGoals);

  useEffect(() => {
    fetchTotalActiveGoalAmount();
    fetchLongestTimePeriod();
    analysisData();
    fetchCategoryByGoals();
  }, [fetchTotalActiveGoalAmount, fetchLongestTimePeriod, analysisData, fetchCategoryByGoals]);

  const handleGoalCreated = useCallback(() => {
    fetchGoals(); // Fetch the updated goals after a new goal is created
    fetchTotalActiveGoalAmount(); // Fetch the updated total active goal amount
    fetchLongestTimePeriod();
    analysisData();
    fetchCategoryByGoals();
  }, [fetchGoals, fetchTotalActiveGoalAmount, fetchLongestTimePeriod, analysisData, fetchCategoryByGoals]); 

  const handleGoalInput = function () {
    setIsGoalInputModalOpen(true);
  };

  return (
    <section className="w-full py-6 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Title and Action Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Financial Goals Dashboard</h1>
          <Button
            className="bg-[#00a9e0] text-white hover:bg-[#0090c0] transition-colors duration-200 shadow-md"
            onClick={handleGoalInput}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-md border-t-4 border-[#00a9e0] transition-transform duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-600">Total Goal Amount</p>
                <Wallet className="w-5 h-5 text-[#004a7c]" />
              </div>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-2">₹ {totalActiveGoalAmount.toLocaleString()}</h2>
              <div className="w-full bg-gray-100 h-1 rounded-full">
                <div className="bg-[#00a9e0] h-1 rounded-full w-3/4"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-[#00a9e0] transition-transform duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-600">Monthly Payment Required</p>
                <Calendar className="w-5 h-5 text-[#004a7c]" />
              </div>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-2">₹ {(totalActiveGoalAmount / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
              <div className="w-full bg-gray-100 h-1 rounded-full">
                <div className="bg-[#00a9e0] h-1 rounded-full w-1/2"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-[#00a9e0] transition-transform duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-600">Current Payment Rate</p>
                <TrendingUp className="w-5 h-5 text-[#004a7c]" />
              </div>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-2">₹ {(totalActiveGoalAmount / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
              <div className="w-full bg-gray-100 h-1 rounded-full">
                <div className="bg-[#00a9e0] h-1 rounded-full w-2/3"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-[#00a9e0] transition-transform duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-600">Longest Goal Timeline</p>
                <Clock className="w-5 h-5 text-[#004a7c]" />
              </div>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-2">{longestTimePeriod ? longestTimePeriod : `0 Y, 0 M, 0 D`}</h2>
              <div className="w-full bg-gray-100 h-1 rounded-full">
                <div className="bg-[#00a9e0] h-1 rounded-full w-4/5"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SMART Goal Progress */}
        <Card className="mb-8 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white">
            <CardTitle className="text-xl font-semibold">
              SMART Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: 'Specific', key: 'specific', color: '#4CAF50' },
                { name: 'Measurable', key: 'measurable', color: '#2196F3' },
                { name: 'Achievable', key: 'achievable', color: '#FF9800' },
                { name: 'Relevant', key: 'relevant', color: '#9C27B0' },
                { name: 'Time-Bound', key: 'timeBound', color: '#F44336' }
              ].map((criteria, index) => {
                const score = smartAnalysis?.analysisResult?.criteriaScores?.[criteria.key] || 0;
                
                return (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between mb-3">
                      <span className="font-medium text-gray-700">{criteria.name}</span>
                      <span className="font-bold text-[#004a7c]">{score}%</span>
                    </div>
                    <Progress 
                      value={score} 
                      className="h-2 bg-gray-100" 
                      style={{ 
                        ['--progress-background' as string]: criteria.color 
                      }} 
                    />
                    <div className="mt-2 text-xs text-gray-500 text-right">
                      {score < 50 ? 'Needs Improvement' : score < 80 ? 'Good' : 'Excellent'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Term Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              title: 'Short Term Goals', 
              timeframe: '< 1 Year', 
              currentAmount: goalsByCategory.shortTermGoalsCurrntAmount, 
              targetAmount: goalsByCategory.shortTermGoalsTargetAmount,
              color: '#4CAF50',
            },
            { 
              title: 'Medium Term Goals', 
              timeframe: '1-5 Years', 
              currentAmount: goalsByCategory.mediumTermGoalsCurrntAmount, 
              targetAmount: goalsByCategory.mediumTermGoalsTargetAmount,
              color: '#FF9800',
            },
            { 
              title: 'Long Term Goals', 
              timeframe: '> 5 Years', 
              currentAmount: goalsByCategory.longTermGoalsCurrntAmount, 
              targetAmount: goalsByCategory.longTermGoalsTargetAmount,
              color: '#2196F3',
            }
          ].map((goal, index) => {
            const percentage = goal.targetAmount > 0 
              ? (100 - Number(((Number(goal.currentAmount) * 100 / Number(goal.targetAmount)).toFixed(2)))) 
              : "0";
              
            return (
              <Card key={index} className="shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: goal.color }}></div>
                      {goal.title}
                    </CardTitle>
                    <span className="text-sm text-gray-500">{goal.timeframe}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gray-50 rounded-lg p-5 relative">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Progress</p>
                          <p className="text-xs text-gray-500">{goal.currentAmount} of {goal.targetAmount}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion</span>
                      <span className="text-sm font-medium" style={{ color: goal.color }}>{percentage}%</span>
                    </div>
                    <Progress
                      value={Number(percentage)}
                      className="h-2 bg-gray-200 mb-4"
                      style={{ ['--progress-background' as string]: goal.color }}
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {Number(percentage) < 30 ? 'Getting Started' : Number(percentage) < 70 ? 'In Progress' : 'Almost There'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Improvement Suggestions */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r rounded-lg from-[#004a7c] to-[#00a9e0] text-white">
            <CardTitle className="text-xl font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Suggested Adjustments */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-3">
                  Overall Assessment
                </h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-[#004a7c] rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">
                        {smartAnalysis?.analysisResult?.feedback?.Overall || "No overall assessment available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specific Suggestions */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-3">
                  Action Items
                </h3>
                <div className="space-y-4">
                  {smartAnalysis?.analysisResult?.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-[#00a9e0] rounded-full"></div>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {suggestion}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="flex">
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          No suggestions available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Input Modal */}
        {isGoalInputModalOpen && (
          <GoalInputModal
            onClose={() => setIsGoalInputModalOpen(false)}
            onGoalCreated={handleGoalCreated}
          />
        )}
      </div>
    </section>
  );
};
