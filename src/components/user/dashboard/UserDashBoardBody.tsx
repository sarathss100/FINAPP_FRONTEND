import React from "react";
import UserHeader from '../base/Header';
import DashboardSection from './sections/DashboardSection/DashboardSection';
import InsightsSection from './sections/InsightsSection/InsightsSection';
import PageTitle from '../base/PageTitle';

const UserDashBoardBody = function () {
  return (
    <div className="w-full max-w-[1184px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Overview`} tag={`Overview of your financials`} />

      <main className="flex flex-col gap-4">
        <DashboardSection />
        <InsightsSection />
      </main>
    </div>
  );
};

export default UserDashBoardBody;
