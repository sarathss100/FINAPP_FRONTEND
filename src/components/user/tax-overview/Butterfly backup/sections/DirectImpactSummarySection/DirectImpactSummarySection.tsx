import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

export const DirectImpactSummarySection = (): JSX.Element => {
  // Data for the impact summary
  const impactData = {
    daily: {
      label: "Daily Impact",
      value: "$12.50",
    },
    weekly: {
      label: "Weekly Impact",
      value: "$87.50",
    },
  };

  return (
    <Card className="w-full rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a] border-0">
      <CardContent className="p-6">
        <div className="flex flex-row gap-9">
          {/* Left section - Initial Cost Analysis */}
          <div className="flex-1">
            <h2 className="font-normal text-xl text-[#004a7c] leading-5 mb-11">
              Initial Cost Analysis
            </h2>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="font-normal text-sm text-gray-700">
                  Purchase Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <Input className="pl-6 rounded-lg" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-normal text-sm text-gray-700">
                  Frequency
                </label>
                <Select defaultValue="one-time">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select frequency">
                      One-time
                    </SelectValue>
                    <ChevronDownIcon className="h-3 w-3 absolute right-3" />
                  </SelectTrigger>
                </Select>
              </div>
            </div>
          </div>

          {/* Right section - Direct Impact Summary */}
          <div className="flex-1 bg-[#004a7c] rounded-xl p-6">
            <h2 className="font-normal text-lg text-white mb-11">
              Direct Impact Summary
            </h2>

            <div className="flex">
              {/* Daily Impact */}
              <div className="flex-1 border-r border-[#00a9e0] pr-4">
                <p className="text-white text-sm leading-[14px]">
                  {impactData.daily.label}
                </p>
                <p className="text-white text-2xl leading-6 mt-[19px]">
                  {impactData.daily.value}
                </p>
              </div>

              {/* Weekly Impact */}
              <div className="flex-1 pl-4">
                <p className="text-white text-sm leading-[14px]">
                  {impactData.weekly.label}
                </p>
                <p className="text-white text-2xl leading-6 mt-[19px]">
                  {impactData.weekly.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
