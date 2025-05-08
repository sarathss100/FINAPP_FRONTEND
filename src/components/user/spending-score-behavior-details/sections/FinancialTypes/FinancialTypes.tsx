import React from "react";
import { Card, CardContent } from '@/components/base/Card';
import Image from 'next/image';

const FinancialTypes = function () {
  // Define the financial personality types data
  const financialTypes = [
    {
      id: 1,
      title: "Spender",
      points: "1-9 points",
      borderColor: "border-red-400",
      textColor: "text-red-400",
      characteristics: [
        {
          text: "High spending, low savings",
          icon: "/alert_icon.svg",
        },
        {
          text: "Frequent impulse purchases",
          icon: "/credit_card_red.svg",
        },
        {
          text: "Limited budget planning",
          icon: "/growth_red.svg",
        },
      ],
    },
    {
      id: 2,
      title: "Balancer",
      points: "10-14 points",
      borderColor: "border-amber-400",
      textColor: "text-amber-400",
      characteristics: [
        {
          text: "Moderate spending and saving",
          icon: "/weigh_yellow.svg",
        },
        {
          text: "Basic budgeting habits",
          icon: "/list_yellow.svg",
        },
        {
          text: "Growing financial awareness",
          icon: "/growth_yellow.svg",
        },
      ],
    },
    {
      id: 3,
      title: "Saver",
      points: "15-19 points",
      borderColor: "border-[#00a9e0]",
      textColor: "text-[#00a9e0]",
      characteristics: [
        {
          text: "Consistent saving habits",
          icon: "/piggy_blue_icon.svg",
        },
        {
          text: "Strong emergency fund",
          icon: "/security_shield_icon.svg",
        },
        {
          text: "Detailed budget tracking",
          icon: "/calculator_icon.svg",
        },
      ],
    },
    {
      id: 4,
      title: "Investor",
      points: "20-25 points",
      borderColor: "border-[#004a7c]",
      textColor: "text-[#004a7c]",
      characteristics: [
        {
          text: "Diversified investment portfolio",
          icon: "/budget_dark_blue_icon.svg",
        },
        {
          text: "Long-term financial goals",
          icon: "/aim_dark_blue_icon.svg",
        },
        {
          text: "Wealth building focus",
          icon: "/finAppLogo.svg",
        },
      ],
    },
  ];

  return (
    <section className="w-full py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financialTypes.map((type) => (
          <Card
            key={type.id}
            className={`bg-white rounded-xl border-l-4 ${type.borderColor} [border-left-style:solid] border-t-0 border-r-0 border-b-0`}
          >
            <CardContent className="p-7">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-xl leading-5">
                  {type.title}
                </h3>
                <span
                  className={`font-['Poppins',Helvetica] font-normal ${type.textColor} text-base leading-4`}
                >
                  {type.points}
                </span>
              </div>

              <div className="space-y-4">
                {type.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center mr-2 mt-1">
                      <Image
                        alt="Icon"
                        src={characteristic.icon}
                        height={16}
                        width={16}
                      />
                    </div>
                    <span className="font-['Poppins',Helvetica] font-normal text-black text-base leading-4">
                      {characteristic.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FinancialTypes;
