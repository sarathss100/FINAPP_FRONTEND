import React from "react";
import { Badge } from '@/components/base/Badge';
import { Card, CardContent} from '@/components/base/Card';

const InvestmentPotentialSection = function () {
  // Data for the charts
  const inflationData = [
    { year: "2025", height: "120px" },
    { year: "2030", height: "150px" },
    { year: "2035", height: "170px" },
  ];

  const opportunityCostData = [
    { period: "5y", height: "80px" },
    { period: "10y", height: "130px" },
    { period: "15y", height: "160px" },
    { period: "20y", height: "200px" },
  ];

  const compoundEffectData = [
    { label: "Principal", percentage: 30, color: "#004a7c" },
    { label: "Interest", percentage: 70, color: "#00a9e0" },
  ];

  return (
    <div className="flex gap-6 w-full mt-6">
      {/* Inflation Impact Card */}
      <Card className="w-full shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
        <CardContent className="p-6">
          <h3 className="text-lg text-[#004a7c] font-normal mb-6 font-['Poppins',Helvetica]">
            Inflation Impact
          </h3>

          <div className="h-[200px] flex items-end gap-2 mb-6">
            {inflationData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-[81px] bg-[#004a7c] rounded-[8px_8px_0px_0px]"
                  style={{ height: item.height }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            {inflationData.map((item, index) => (
              <span
                key={index}
                className="text-sm text-gray-600 font-normal font-['Poppins',Helvetica]"
              >
                {item.year}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Cost Card */}
      <Card className="w-full shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
        <CardContent className="p-6">
          <h3 className="text-lg text-[#004a7c] font-normal mb-6 font-['Poppins',Helvetica]">
            Opportunity Cost
          </h3>

          <div className="h-[200px] flex items-end gap-2 mb-6">
            {opportunityCostData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-[81px] bg-[#00a9e0] rounded-[8px_8px_0px_0px]"
                  style={{ height: item.height }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            {opportunityCostData.map((item, index) => (
              <span
                key={index}
                className="text-sm text-gray-600 font-normal font-['Poppins',Helvetica]"
              >
                {item.period}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compound Effect Card */}
      <Card className="w-full shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
        <CardContent className="p-6">
          <h3 className="text-lg text-[#004a7c] font-normal mb-6 font-['Poppins',Helvetica]">
            Compound Effect
          </h3>

          <div className="space-y-6">
            {compoundEffectData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <Badge
                    className="bg-neutral-100 text-xs font-normal rounded-full px-2 py-1 h-6"
                    variant="outline"
                  >
                    <span
                      className={`text-[${item.color}] font-['Poppins',Helvetica]`}
                    >
                      {item.label}
                    </span>
                  </Badge>
                  <span
                    className={`text-xs text-[${item.color}] text-right font-['Poppins',Helvetica]`}
                  >
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 rounded overflow-hidden">
                  <div
                    className="h-2"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentPotentialSection;
