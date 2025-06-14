import React from "react";
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import DebtManagementSection from './sections/DebtManagementSection/DebtManagementSection';

const DebtAnalysisBody = function () {
  return (
    <div className="w-full max-w-[1187px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Debt Management`} tag={`Manage Your Debt Efficiently`} />

      {/* Main content sections */}
      <main className="w-full">
        <div
          className="relative"
          style={{ top: "4%", left: "0%", height: "83%", width: "100%" }}
        >
          <DebtManagementSection />
        </div>
      </main>
    </div>
  );
};

export default DebtAnalysisBody;
