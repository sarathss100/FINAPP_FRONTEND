import {
  AlertCircleIcon,
  BarChartIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';

const PerformanceMetricsSection = function () {
  // Financial metrics data
  const financialMetrics = [
    {
      title: "Total Revenue",
      value: "$124,563",
      change: "+12.5% vs last month",
      changeColor: "text-emerald-500",
      icon: <DollarSignIcon className="w-4 h-4 text-blue-500" />,
    },
    {
      title: "Expenses",
      value: "$28,947",
      change: "-3.2% vs last month",
      changeColor: "text-red-500",
      icon: <BarChartIcon className="w-4 h-4 text-blue-500" />,
    },
    {
      title: "Net Profit",
      value: "$95,616",
      change: "+15.8% vs last month",
      changeColor: "text-emerald-500",
      icon: <TrendingUpIcon className="w-4 h-4 text-blue-500" />,
    },
    {
      title: "Pending",
      value: "$12,350",
      change: "8 pending transactions",
      changeColor: "text-gray-500",
      icon: <AlertCircleIcon className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl text-[#004a7c] font-['Roboto',Helvetica]">
            Financial Overview
          </h2>

          <Button
            variant="outline"
            className="h-[39px] font-['Roboto',Helvetica] font-normal"
          >
            Last 30 Days
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialMetrics.map((metric, index) => (
            <Card key={index} className="bg-neutral-100 border-0">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-['Roboto',Helvetica] font-normal text-gray-600 text-base">
                    {metric.title}
                  </span>
                  {metric.icon}
                </div>

                <div className="mb-2">
                  <span className="font-['Roboto',Helvetica] font-bold text-black text-2xl">
                    {metric.value}
                  </span>
                </div>

                <div>
                  <span
                    className={`font-['Roboto',Helvetica] font-normal text-sm ${metric.changeColor}`}
                  >
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsSection;
