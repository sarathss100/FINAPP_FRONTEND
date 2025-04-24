"use client";
import { PlusIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Progress } from '@/components/base/progress';
import Image from 'next/image';
import GoalInputModal from '../GoalInputModal';
import { useGoalStore } from '@/stores/store';

export const GoalManagementSection = function () {
  const [isGoalInputModalOpen, setIsGoalInputModalOpen] = useState(false);
  const totalActiveGoalAmount = useGoalStore((state) => state.totalActiveGoalAmount);
  const fetchTotalActiveGoalAmount = useGoalStore((state) => state.fetchTotalActiveGoalAmount);
  const fetchGoals = useGoalStore(state => state.fetchGoals);

  useEffect(() => {
    fetchTotalActiveGoalAmount(); 
  }, [fetchTotalActiveGoalAmount]);

  const handleGoalCreated = useCallback(() => {
    fetchGoals(); // Fetch the updated goals after a new goal is created
    fetchTotalActiveGoalAmount(); // Fetch the updated total active goal amount

  }, [fetchGoals, fetchTotalActiveGoalAmount]);

  const handleGoalInput = function () {
    setIsGoalInputModalOpen(true);
  };

  // SMART goals data
  const smartGoals = [
    { name: "Specific", progress: 90 },
    { name: "Measurable", progress: 85 },
    { name: "Achievable", progress: 75 },
    { name: "Realistic", progress: 80 },
    { name: "Time-bound", progress: 95 },
  ];

  // Term goals data
  const termGoals = [
    {
      title: "Short Term Goals",
      timeframe: "< 1 Year",
      goal: {
        name: "Emergency Fund",
        current: "$15,000",
        target: "$20,000",
        progress: 75,
        timeLeft: "4 months left",
      },
    },
    {
      title: "Medium Term Goals",
      timeframe: "1-5 Years",
      goal: {
        name: "Down Payment",
        current: "$50,000",
        target: "$100,000",
        progress: 50,
        timeLeft: "2 years left",
      },
    },
    {
      title: "Long Term Goals",
      timeframe: "5+ Years",
      goal: {
        name: "Retirement",
        current: "$200K",
        target: "$1M",
        progress: 20,
        timeLeft: "25 years left",
      },
    },
  ];

  // Reallocation data
  const reallocationData = {
    adjustments: [
      {
        name: "Reduce Entertainment Budget",
        current: "$500/month",
        suggested: "$300/month",
        change: "-$200",
      },
      {
        name: "Optimize Subscriptions",
        current: "$150/month",
        suggested: "$100/month",
        change: "-$50",
      },
    ],
    impact: {
      monthlySavings: "+$250",
      speedImprovement: "15% Faster",
    },
  };

  // What-if scenarios data
  const whatIfScenarios = [
    {
      title: "Increased Income",
      current: { label: "Current Monthly", value: "$5,000" },
      potential: { label: "Potential Monthly", value: "$6,000" },
      progress: 80,
      impact: "Goals achieved 20% faster",
    },
    {
      title: "Additional Investment",
      current: { label: "Current Return", value: "7% APY" },
      potential: { label: "Enhanced Return", value: "9% APY" },
      progress: 75,
      impact: "28% more in 10 years",
    },
    {
      title: "Expense Reduction",
      current: { label: "Current Expenses", value: "$3,500" },
      potential: { label: "Target Expenses", value: "$3,000" },
      progress: 65,
      impact: "$500 more for goals",
    },
  ];

  return (
    <section className="w-full">
      <div className="w-full max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end mb-8">
          <Button
            className="bg-[#00a9e0] text-white hover:bg-[#0090c0] mr-4"
            onClick={handleGoalInput}
          >
            <PlusIcon className="w-3.5 h-4 mr-2" />
            Add Goal
          </Button>
          {/* <Button variant="outline" className="border-[#004a7c] text-[#004a7c]">
            <Image
              className="mr-2"
              alt="Import/Export"
              src="/export_import_icon.svg"
              height={16}
              width={16}
            />
            Import/Export
          </Button> */}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-4">Total Goal Amount</p>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-4">₹ {totalActiveGoalAmount}</h2>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-4">Monthly Payment Required</p>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-4">₹ {(totalActiveGoalAmount / 12).toFixed(0)}</h2>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-4">Current Payment Rate</p>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-4">₹ {(totalActiveGoalAmount / 12).toFixed(0)}</h2>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-4">Time Left to Achieve the Goal</p>
              <h2 className="text-3xl font-bold text-[#004a7c] mb-4">3 Year 2 Month</h2>
            </CardContent>
          </Card>
        </div>

        {/* SMART Goal Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              SMART Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {smartGoals.map((goal, index) => (
                <div key={index} className="bg-[#004a7c1a] rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-black">{goal.name}</span>
                    <span className="text-[#004a7c]">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2 bg-gray-200" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Term Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {termGoals.map((term, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    {term.title}
                  </CardTitle>
                  <span className="text-sm text-gray-500">
                    {term.timeframe}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-base">{term.goal.name}</h3>
                    <Image alt="Options" src="/options_icon.svg" width={4} height={16} />
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {term.goal.current} / {term.goal.target}
                    </span>
                    <span className="text-sm text-[#00a9e0]">
                      {term.goal.progress}%
                    </span>
                  </div>
                  <Progress
                    value={term.goal.progress}
                    className="h-2 bg-gray-200 mb-4"
                  />
                  <div className="flex items-center">
                    <Image
                      className="mr-2"
                      alt="Clock"
                      src="/expiery_icon.svg"
                      width={14}
                      height={14}
                    />
                    <span className="text-sm text-gray-500">
                      {term.goal.timeLeft}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reallocation Opportunities */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              Reallocation Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Suggested Adjustments */}
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-6">
                  Suggested Adjustments
                </h3>
                <div className="space-y-6">
                  {reallocationData.adjustments.map((adjustment, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium text-black mb-2">
                          {adjustment.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current: {adjustment.current}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#00a9e0] mb-2">
                          {adjustment.change}
                        </p>
                        <p className="text-sm text-gray-500">
                          Suggested: {adjustment.suggested}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Impact */}
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-6">
                  Potential Impact
                </h3>
                <div className="mb-6">
                  <p className="text-base font-medium text-black mb-1">
                    Monthly Savings
                  </p>
                  <p className="text-3xl font-bold text-[#004a7c]">
                    {reallocationData.impact.monthlySavings}
                  </p>
                </div>
                <div>
                  <p className="text-base font-medium text-black mb-1">
                    Goal Achievement Speed
                  </p>
                  <p className="text-lg text-[#00a9e0]">
                    {reallocationData.impact.speedImprovement}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What-If Scenarios */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              What-If Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whatIfScenarios.map((scenario, index) => (
                <div key={index} className="bg-neutral-100 rounded-lg p-4">
                  <h3 className="font-medium text-base mb-6">
                    {scenario.title}
                  </h3>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-black">
                      {scenario.current.label}
                    </span>
                    <span className="text-base font-medium text-black">
                      {scenario.current.value}
                    </span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-black">
                      {scenario.potential.label}
                    </span>
                    <span className="text-base font-medium text-[#00a9e0]">
                      {scenario.potential.value}
                    </span>
                  </div>
                  <Progress
                    value={scenario.progress}
                    className="h-2 bg-gray-200 mb-4"
                  />
                  <p className="text-sm text-gray-500">{scenario.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phone Number Verification Modal */}
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
