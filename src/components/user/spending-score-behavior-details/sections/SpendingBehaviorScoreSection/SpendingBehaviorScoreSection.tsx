import React from "react";
import { Card, CardContent } from '@/components/base/Card';

const SpendingBehaviorScoreSection = function () {
  const scoreCategories = [
    {
      title: "1-9 Points: Room for Improvement",
      description:
        "Focus on building better spending habits and start tracking your expenses. Consider creating a budget and identifying areas where you can cut back.",
      bgColor: "bg-red-50",
      titleColor: "text-red-700",
    },
    {
      title: "10-14 Points: Good Progress",
      description:
        "You're on the right track with balanced financial habits. Continue to build your emergency fund and work on increasing your savings rate.",
      bgColor: "bg-amber-50",
      titleColor: "text-amber-700",
    },
    {
      title: "15-19 Points: Great Financial Habits",
      description:
        "Your disciplined approach to saving is commendable. Consider exploring investment opportunities to make your money work harder for you.",
      bgColor: "bg-blue-50",
      titleColor: "text-[#00a9e0]",
    },
    {
      title: "20-25 Points: Financial Expert",
      description:
        "Outstanding financial management! Your balanced approach to spending, saving, and investing sets you up for long-term financial success.",
      bgColor: "bg-[#004a7c1a]",
      titleColor: "text-[#004a7c]",
    },
  ];

  return (
    <section className="w-full p-6 bg-white rounded-xl">
      <header className="mb-6">
        <h2 className="font-normal text-2xl text-[#004a7c] font-['Poppins',Helvetica]">
          Score Appreciation
        </h2>
      </header>

      <div className="flex flex-col space-y-7">
        {scoreCategories.map((category, index) => (
          <Card
            key={index}
            className={`${category.bgColor} rounded-lg border-0`}
          >
            <CardContent className="p-4">
              <div className="mb-2">
                <h3
                  className={`font-normal text-base ${category.titleColor} font-['Poppins',Helvetica]`}
                >
                  {category.title}
                </h3>
              </div>
              <div>
                <p className="font-normal text-base text-gray-700 font-['Poppins',Helvetica]">
                  {category.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SpendingBehaviorScoreSection;
