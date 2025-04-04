import React from "react";
import { Card, CardContent } from '@/components/Card';

export const FeaturesSection = () => {
  return (
    <section className="w-full bg-[#004a7c] py-16">
      <div className="container mx-auto px-4">
        <Card className="border-0 bg-transparent">
          <CardContent className="p-0">
            <div className="flex flex-col gap-6">
              <h2 className="font-['Montserrat',Helvetica] font-bold text-white text-5xl leading-[48px]">
                Planning &amp; Goals
              </h2>
              <p className="font-['Montserrat',Helvetica] font-normal text-[#ffffffe6] text-xl leading-5">
                Take control of your financial future with our comprehensive
                planning tools and expert guidance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
