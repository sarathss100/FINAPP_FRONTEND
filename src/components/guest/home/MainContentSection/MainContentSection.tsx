import React from "react";
import { Card, CardContent } from '@/components/base/Card';
import Image from 'next/image';

export const MainContentSection = () => {
  // Data for investment categories
  const investmentCategories = [
    {
      id: 1,
      title: "Low Risk",
      icon: "/risklvl1.svg",
      options: ["Money Market", "Treasury Bills", "Bonds"],
    },
    {
      id: 2,
      title: "Moderate Risk",
      icon: "/risklvl2.svg",
      options: ["Mutual Funds", "Index Funds", "Balanced Portfolios"],
    },
    {
      id: 3,
      title: "High Risk",
      icon: "/risklvl2.svg",
      options: ["Individual Stocks", "Cryptocurrency", "Commodities"],
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-4xl text-center text-[#004a7c] font-normal font-['Poppins',Helvetica] mb-14 leading-9">
          Smart Investment Categories
        </h2>

        <div className="flex flex-wrap justify-between gap-4">
          {investmentCategories.map((category) => (
            <Card
              key={category.id}
              className="w-full md:w-[389px] rounded-xl border border-solid"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-5">
                  <div className="flex items-center justify-center">
                    <Image
                      className="w-6 h-6"
                      height={24}
                      width={24}
                      alt={`${category.title} icon`}
                      src={category.icon}
                    />
                  </div>
                  <span className="ml-3 font-['Poppins',Helvetica] font-normal text-black text-xl leading-5">
                    {category.title}
                  </span>
                </div>

                <div className="space-y-6">
                  {category.options.map((option, index) => (
                    <div key={index} className="h-6">
                      <div className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base">
                        {option}
                      </div>
                    </div>
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
