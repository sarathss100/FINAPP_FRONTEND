import React from "react";
import FinancialTypes from './sections/FinancialTypes/FinancialTypes';
import SpendingBehaviorScoreHeader from './sections/SpendingBehaviorScoreHeader/SpendingBehaviorScoreHeader';
import SpendingBehaviorScoreSection from './sections/SpendingBehaviorScoreSection/SpendingBehaviorScoreSection';

const SpendingBehaviorScoreDetailsBody = function () {
  return (
    <main className="flex flex-col w-full min-h-screen bg-neutral-100">
      <SpendingBehaviorScoreHeader />
      <FinancialTypes />
      <SpendingBehaviorScoreSection />
    </main>
  );
};

export default SpendingBehaviorScoreDetailsBody;
