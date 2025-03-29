import React from "react";
import { Card, CardContent } from '@/components/Card';
import Image from 'next/image';

export const FinancialCommandCenterSection = () => {
  // Feature data for mapping
  const features = [
    {
      id: 1,
      icon: "/graph.svg",
      title: "Smart Analytics",
      description: [
        "Advanced analytics with expense",
        "tracking, income analysis, and",
        "investment performance metrics",
      ],
    },
    {
      id: 2,
      icon: "/goal.svg",
      title: "Goal Planning",
      description: [
        "Set and track financial goals with smart",
        "recommendations and progress",
        "monitoring",
      ],
    },
    {
      id: 3,
      icon: "/secure.svg",
      title: "Secure Management",
      description: [
        "Bank-level security for your accounts",
        "with multi-factor authentication",
      ],
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container max-w-[1280px] mx-auto px-5">
        <h2 className="text-4xl text-center text-[#004a7c] font-normal font-['Poppins',Helvetica] mb-14 leading-9">
          Powerful Features for Your Financial Success
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-gray-50 rounded-xl border-0">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-[30px] h-[30px] flex items-center justify-center mb-2">
                    <Image
                      width={30}
                      height={30}
                      alt={feature.title}
                      src={feature.icon}
                    />
                  </div>
                  <h3 className="font-['Poppins',Helvetica] font-normal text-black text-xl mt-9">
                    {feature.title}
                  </h3>
                </div>
                <div className="mt-4">
                  {feature.description.map((line, index) => (
                    <p
                      key={index}
                      className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base mb-1.5"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
