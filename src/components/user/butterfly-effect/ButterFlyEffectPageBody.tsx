import React from "react";
import Button from '@/components/base/Button';
import Image from 'next/image';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import InvestmentPotentialSection from './sections/InvestmentPotentialSection/InvestmentPotentialSection';
import DirectImpactSummarySection from './sections/DirectImpactSummarySection/DirectImpactSummarySection';

const ButterflyEffectPageBody = function () {
  return (
    <div className="w-full max-w-[1187px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`ButterflyEffect`} tag={`You can see the future`} />

      <main>
        {/* Main content area */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            {/* Import/Export button */}
            <div className="ml-auto">
              <Button
                variant="outline"
                className="h-[42px] border-[#004a7c] text-[#004a7c] font-['Poppins',Helvetica]"
              >
                <Image
                  className="mr-2"
                  alt="Import/Export"
                  src="/export_import_icon.svg"
                  width={16}
                  height={16}
                />
                Import/Export
              </Button>
            </div>
          </div>

          {/* Main sections */}
          <DirectImpactSummarySection />
          <InvestmentPotentialSection />
        </div>
      </main>
    </div>
  );
};

export default ButterflyEffectPageBody;
