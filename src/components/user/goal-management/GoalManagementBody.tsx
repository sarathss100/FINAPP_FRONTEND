import React from "react";
import { GoalManagementSection } from './GoalManagementSection/GoalManagementSection';
import { MainContentSection } from './MainContentSection/MainContentSection';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';

export const GoalManagementBody = ()=> {
  return (
    <div className="max-w-[1184px] mx-auto p-8 font-sans">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Goal Management`} tag={`Manage Your Goals Efficiently`} />
      <main className="w-full">
        <GoalManagementSection />
        <MainContentSection />
      </main>
    </div>
  );
};
