import { CheckCircleIcon } from "lucide-react";
import React from "react";
import { Card } from '@/components/base/Card';

export const PlanningGoalsSection = () => {
  // Data for feature items
  const features = [
    {
      title: "Personalized Planning",
      description:
        "Tailored solutions based on your unique financial situation",
    },
    {
      title: "Progress Tracking",
      description: "Monitor your goals and adjust strategies in real-time",
    },
    {
      title: "Expert Guidance",
      description: "Access to financial advisors and educational resources",
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left content */}
          <div className="flex-1 space-y-12">
            <h2 className="font-bold font-['Montserrat',Helvetica] text-[#004a7c] text-4xl leading-9">
              Take Control of Your Financial Future
            </h2>

            <p className="font-['Montserrat',Helvetica] text-gray-600 text-lg leading-[18px] max-w-[518px]">
              Our comprehensive planning tools help you create a solid
              foundation for your financial goals.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-5 h-5 mt-1">
                    <CheckCircleIcon className="w-5 h-5 text-[#004a7c]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-['Montserrat',Helvetica] font-semibold text-[#004a7c] text-xl leading-5">
                      {feature.title}
                    </h3>
                    <p className="font-['Montserrat',Helvetica] font-normal text-gray-600 text-base leading-4">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="flex-1">
            <Card className="h-[500px] rounded-xl overflow-hidden shadow-[0px_25px_50px_#00000040] border-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url(../img-2.png)" }}
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
