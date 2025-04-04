import React from "react";
import { Card } from '@/components/base/Card';
import Link from 'next/link';
import Button from '@/components/base/Button';

export const ControlYourFinancialFutureSection = function () {
  return (
    <section className="w-full py-12 [background:linear-gradient(90deg,rgba(0,74,124,1)_0%,rgba(0,169,224,1)_100%)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-6xl font-normal text-white leading-[60px] font-['Poppins',Helvetica] max-w-[531px]">
              Smart Financial Management for Your Future
            </h2>

            <p className="text-xl font-normal text-white leading-5 font-['Poppins',Helvetica] max-w-[535px]">
              Take control of your finances with our comprehensive personal
              finance management solution.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={'/signup'}
                passHref
              >
                <Button className="h-[52px] px-8 rounded-full bg-white text-[#004a7c] hover:bg-white/90 font-['Poppins',Helvetica] font-normal text-base">
                  Get Started
                </Button>
              </Link>
              

              <Button
                variant="outline"
                className="h-[52px] px-8 rounded-full border-2 bg-white text-[#004a7c] border-white hover:bg-white/90 font-['Poppins',Helvetica] font-normal text-base"
              >
                Learn More
              </Button>
            </div>
          </div>

          <Card className="flex-1 h-[616px] rounded-lg shadow-[0px_25px_50px_#00000040] border-0 overflow-hidden">
            <div className="h-full w-full [background:url(/img.png)_50%_50%_/_cover]" />
          </Card>
        </div>
      </div>
    </section>
  );
};
