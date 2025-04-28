"use client";
import React, { useEffect } from "react";
import { GoalManagementSection } from './GoalManagementSection/GoalManagementSection';
import { MainContentSection } from './MainContentSection/MainContentSection';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
// import { MainContentSectionDemo } from './MainContentSection/MainContentSection copy';
import { useGoalStore } from '@/stores/store';

export const GoalManagementBody = () => {
  const fetchAllGoals = useGoalStore((state) => state.fetchAllGoals);
  const fetchCategoryByGoals = useGoalStore((state) => state.fetchCategoryByGoals);
  const fetchLongestTimePeriod = useGoalStore((state) => state.fetchLongestTimePeriod);
  const fetchTotalActiveGoalAmount = useGoalStore((state) => state.fetchTotalActiveGoalAmount);
  const fetchSmartAnalysis = useGoalStore((state) => state.fetchSmartAnalysis);
  const fetchDailyContribution = useGoalStore((state) => state.fetchDailyContribution);
  const fetchMonthlyContribution = useGoalStore((state) => state.fetchMonthlyContribution);

  useEffect(() => {
    fetchAllGoals();
    fetchCategoryByGoals();
    fetchLongestTimePeriod();
    fetchTotalActiveGoalAmount();
    fetchSmartAnalysis();
    fetchDailyContribution();
    fetchMonthlyContribution();
  }, [fetchAllGoals, fetchCategoryByGoals, fetchLongestTimePeriod, fetchTotalActiveGoalAmount, fetchSmartAnalysis, fetchDailyContribution, fetchMonthlyContribution]);

  return (
    <div className="max-w-[1184px] mx-auto font-sans">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Goal Management`} tag={`Manage Your Goals Efficiently`} />
      <main className="w-full">
        <GoalManagementSection />
        <MainContentSection />
        {/* <MainContentSectionDemo /> */}
      </main>
    </div>
  );
};
