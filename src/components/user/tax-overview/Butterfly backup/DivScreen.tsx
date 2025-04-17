import { SearchIcon } from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import { DirectImpactSummarySection } from "./sections/DirectImpactSummarySection";
import { ExpenseAnalysisSection } from "./sections/ExpenseAnalysisSection";
import { InvestmentPotentialSection } from "./sections/InvestmentPotentialSection";
import Image from 'next/image';

export const DivScreen = function () {
  return (
    <div className="w-full max-w-[1187px] mx-auto">
      

      <main className="px-8">
        {/* Main content area */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            {/* Import/Export button */}
            <div className="ml-auto">
              <Button
                variant="outline"
                className="h-[42px] border-[#004a7c] text-[#004a7c] font-['Poppins',Helvetica]"
              >
                <img
                  className="mr-2 w-4 h-4"
                  alt="Import/Export"
                  src="/frame-6.svg"
                />
                Import/Export
              </Button>
            </div>
          </div>

          {/* Main sections */}
          <ExpenseAnalysisSection />
          <DirectImpactSummarySection />
          <InvestmentPotentialSection />
        </div>
      </main>
    </div>
  );
};
