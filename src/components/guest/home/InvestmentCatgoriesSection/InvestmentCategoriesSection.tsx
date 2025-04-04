import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/base/Card';
import CategoryCard from '@/types/ICategoryCard';
import Image from 'next/image';
import Button from '@/components/base/Button';

export const InvestmentCategoriesSection = () => {
  // Data for the investment category cards
  const categoryCards: CategoryCard[] = [
    {
      icon: "/piggy.svg",
      title: "Saving Goals",
      description: [
        "Set and track your savings",
        "targets with smart tools and",
        "personalized strategies",
      ],
      features: [
        { text: "Goal tracking" },
        { text: "Progress monitoring" },
        { text: "Custom milestones" },
      ],
      buttonText: "Learn More",
    },
    {
      icon: "/graph.svg",
      title: "Debt Management",
      description: [
        "Create a structured plan to",
        "reduce and eliminate your debt",
        "effectively",
      ],
      features: [
        { text: "Debt calculator" },
        { text: "Payment planning" },
        { text: "Interest tracking" },
      ],
      buttonText: "Learn More",
    },
    {
      icon: "/business.svg",
      title: "Investment Planning",
      description: [
        "Build and manage your",
        "investment portfolio with expert",
        "guidance",
      ],
      features: [
        { text: "Portfolio analysis" },
        { text: "Risk assessment" },
        { text: "Market insights" },
      ],
      buttonText: "Learn More",
    },
    {
      icon: "/shield.svg",
      title: "Emergency Fund",
      description: [
        "Build your safety net with smart",
        "emergency fund planning tools",
      ],
      features: [
        { text: "Fund calculator" },
        { text: "Savings strategies" },
        { text: "Auto-savings" },
      ],
      buttonText: "Learn More",
    },
  ];

  return (
    <section className="w-full py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((card, index) => (
            <Card
              key={index}
              className="rounded-xl shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]"
            >
              <CardHeader className="pb-0 pt-6 px-6">
                <div className="w-12 h-12 bg-[#00a9e0] rounded-full flex items-center justify-center mb-6">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <Image width={24} height={24} alt={card.title} src={card.icon} />
                  </div>
                </div>
                <CardTitle className="font-bold text-xl text-[#004a7c] font-['Raleway',Helvetica]">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="mt-2 mb-4">
                  {card.description.map((line, i) => (
                    <p
                      key={i}
                      className="font-['Raleway',Helvetica] font-normal text-gray-600 text-base"
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div className="space-y-2 mt-4">
                  {card.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-3.5 h-4 mr-[18px] flex items-center justify-center">
                        <Image
                          width={14}
                          height={16}
                          alt="Check"
                          src="/tick.svg"
                        />
                      </div>
                      <span className="font-['Raleway',Helvetica] font-normal text-gray-600 text-base">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6">
                <Button className="w-full h-10 bg-[#004a7c] text-white rounded-lg font-['Raleway',Helvetica] font-normal text-base">
                  {card.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
