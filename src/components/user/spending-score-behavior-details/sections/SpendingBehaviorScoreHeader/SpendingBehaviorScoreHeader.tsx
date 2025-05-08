import React from "react";
import { Card, CardContent } from '@/components/base/Card';

const SpendingBehaviorScoreHeader = function () {
  return (
    <Card className="w-full p-6 shadow-sm rounded-xl">
      <CardContent className="p-0 space-y-6">
        <div>
          <h1 className="font-normal text-3xl text-[#004a7c] font-['Poppins',Helvetica]">
            Spending Behavior Score
          </h1>
        </div>
        <div>
          <p className="font-normal text-base text-gray-600 font-['Poppins',Helvetica]">
            Understand your financial personality based on your spending
            patterns
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingBehaviorScoreHeader;
