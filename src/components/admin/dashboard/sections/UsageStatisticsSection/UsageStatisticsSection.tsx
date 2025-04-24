import React from "react";
import { Card, CardContent } from '@/components/base/Card';
import { Progress } from '@/components/base/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/base/toggle-group';
import Image from 'next/image';

// Define data for statistics cards
const statisticsData = [
  {
    title: "Active Users",
    value: "2,847",
    progressValue: 67, // ~153px out of 229px
    icon: "/group_blue_icon.svg",
    width: "283px",
  },
  {
    title: "Total Sessions",
    value: "12,589",
    progressValue: 76, // ~156px out of 205px
    icon: "/timeup_blue_icon.svg",
    width: "256px",
  },
  {
    title: "Avg. Session Duration",
    value: "24m 32s",
    progressValue: 65, // ~260px out of 400px
    icon: "/timer_blue_icon.svg",
    width: "432px",
  },
];

// Define data for performance metrics
// const performanceData = [
//   {
//     title: "CPU Usage",
//     value: "42%",
//     progressValue: 42,
//     icon: "/frame-14.svg",
//     width: "184px",
//   },
//   {
//     title: "Memory Usage",
//     value: "68%",
//     progressValue: 68,
//     icon: "/frame-12.svg",
//     width: "185px",
//   },
//   {
//     title: "Disk Usage",
//     value: "75%",
//     progressValue: 75,
//     icon: "/frame-6.svg",
//     width: "318px",
//   },
//   {
//     title: "Network",
//     value: "92%",
//     progressValue: 92,
//     icon: "/frame-18.svg",
//     width: "318px",
//   },
// ];

const UsageStatisticsSection = function () {
  return (
    <Card className="w-full rounded-xl shadow-[0px_1px_2px_#0000000d]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl text-[#004a7c] font-['Roboto',Helvetica]">
            Usage Statistics
          </h2>

          <ToggleGroup type="single" defaultValue="weekly">
            <ToggleGroupItem
              value="daily"
              className="h-10 px-4 rounded-lg bg-neutral-100 text-black font-['Roboto',Helvetica] font-normal"
            >
              Daily
            </ToggleGroupItem>
            <ToggleGroupItem
              value="weekly"
              className="h-10 px-4 rounded-lg bg-[#00a9e0] text-white font-['Roboto',Helvetica] font-normal"
            >
              Weekly
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="h-10 px-4 rounded-lg bg-neutral-100 text-black font-['Roboto',Helvetica] font-normal"
            >
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex gap-[41px]">
          {statisticsData.map((stat, index) => (
            <Card
              key={index}
              className="bg-neutral-100 rounded-lg flex-1"
              style={{ maxWidth: stat.width }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-base font-['Roboto',Helvetica] font-normal">
                    {stat.title}
                  </span>
                  <Image
                    alt={`${stat.title} icon`}
                    src={stat.icon}
                    width={20}
                    height={16}
                  />
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-black font-['Roboto',Helvetica]">
                    {stat.value}
                  </span>
                </div>

                <Progress
                  value={stat.progressValue}
                  className="h-2 bg-gray-200 rounded-full"
                  style={{ backgroundColor: '#00a9e0', borderRadius: '9999px' }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatisticsSection;
