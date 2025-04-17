import React from "react";
import { Card, CardContent } from '@/components/base/Card';
import Image from 'next/image';

const RecommendationsSection = function () {
  // Data for recommendation cards
  const recommendations = [
    {
      id: 1,
      icon: "/lightning_icon.svg",
      title: "Quick Win",
      description:
        "Pay off Credit Card A first to save $2,124 in interest over the next year.",
    },
    {
      id: 2,
      icon: "/piggy_blue_icon.svg",
      title: "Consolidation Option",
      description:
        "Consider debt consolidation loan at 12% APR to save $890 annually.",
    },
  ];

  return (
    <section className="w-full p-6 bg-white rounded-xl shadow-[0px_1px_2px_#0000000d]">
      <div className="mb-6">
        <h2 className="font-normal text-xl text-[#004a7c] font-['Poppins',Helvetica]">
          Personalized Recommendations
        </h2>
      </div>

      <div className="flex flex-wrap gap-6">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            className="w-[432px] h-32 bg-neutral-100 border-0"
          >
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <div className="w-[27px] h-6 flex items-center justify-center">
                    <Image
                      alt="Icon"
                      src={recommendation.icon}
                      height={24}
                      width={24}
                    />
                  </div>
                </div>
                <h3 className="font-['Poppins',Helvetica] font-normal text-[#004a7c] text-base">
                  {recommendation.title}
                </h3>
              </div>
              <p className="font-['Poppins',Helvetica] font-normal text-gray-600 text-sm">
                {recommendation.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsSection;
