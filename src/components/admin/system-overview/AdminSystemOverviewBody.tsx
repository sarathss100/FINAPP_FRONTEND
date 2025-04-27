import {
  AlertTriangleIcon,
  BellIcon,
  RotateCwIcon,
  SearchIcon,
  ServerIcon,
  Trash2Icon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { Avatar } from '@/components/base/Avatar';
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle  } from '@/components/base/Card';
import Input from '@/components/base/Input';
import Image from 'next/image';

const AdminSystemOverviewBody = function () {
  // Data for metric cards
  const metricCards = [
    {
      title: "Active Users",
      value: "2,451",
      change: "12% from last week",
      trend: "up",
      icon: <UsersIcon className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "New Registrations",
      value: "145",
      change: "8% from last week",
      trend: "up",
      icon: <UsersIcon className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "System Health",
      value: "98.9%",
      change: "All systems operational",
      trend: "stable",
      icon: <ServerIcon className="w-5 h-5 text-blue-500" />,
    },
  ];

  // Data for recent activities
  const recentActivities = [
    {
      title: "New user registration",
      time: "2 minutes ago",
      icon: <UsersIcon className="w-5 h-4" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "ServerIcon backup completed",
      time: "15 minutes ago",
      icon: <ServerIcon className="w-4 h-4" />,
      bgColor: "bg-emerald-100",
    },
    {
      title: "System alert resolved",
      time: "1 hour ago",
      icon: <AlertTriangleIcon className="w-4 h-4" />,
      bgColor: "bg-amber-100",
    },
  ];

  // Data for critical alerts
  // const criticalAlerts = [
  //   {
  //     title: "High CPU Usage",
  //     description: "ServerIcon ID: SRV-042",
  //     type: "error",
  //     icon: <AlertTriangleIcon className="w-4 h-4" />,
  //   },
  //   {
  //     title: "Storage Space Warning",
  //     description: "85% capacity reached",
  //     type: "warning",
  //     icon: <AlertTriangleIcon className="w-4 h-4" />,
  //   },
  // ];

  return (
    <main className="w-full max-w-[1184px] mx-auto">
      <header className="p-8 flex justify-between items-center">
        <div className="relative w-[373px]">
          <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 h-[42px] font-['Poppins'] text-base"
            placeholder="SearchIcon..."
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <BellIcon className="w-3.5 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
          </div>
          <Avatar className="w-10 h-10">
            <Image
              src="/img.png"
              alt="User profile"
              className="object-cover"
              width={24}
              height={24}
            />
          </Avatar>
        </div>
      </header>

      <section className="px-8">
        <div className="mb-14">
          <h1 className="font-bold text-2xl text-[#004a7c] font-['Roboto'] leading-6">
            System Overview
          </h1>
          <p className="text-gray-500 text-base mt-4 font-['Roboto'] leading-4">
            Welcome back, Admin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metricCards.map((card, index) => (
            <Card
              key={index}
              className="shadow-[0px_1px_2px_#0000000d] rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-['Roboto'] text-base leading-4">
                    {card.title}
                  </span>
                  {card.icon}
                </div>
                <h2 className="font-bold text-3xl text-[#004a7c] font-['Roboto'] mb-6">
                  {card.value}
                </h2>
                <div className="flex items-center">
                  {card.trend === "up" && (
                    <TrendingUpIcon className="w-2.5 h-3.5 text-emerald-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${card.trend === "up" ? "text-emerald-500" : "text-emerald-500"} font-['Roboto']`}
                  >
                    {card.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto']">
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`${activity.bgColor} w-10 h-10 rounded-full flex items-center justify-center mr-4`}
                    >
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-gray-800 font-['Roboto'] text-base leading-4">
                        {activity.title}
                      </p>
                      <p className="text-gray-500 font-['Roboto'] text-sm leading-[14px] mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto']">
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangleIcon className="w-4 h-4 text-red-700 mr-3" />
                    <div>
                      <p className="text-red-700 font-['Roboto'] text-base leading-4">
                        High CPU Usage
                      </p>
                      <p className="text-red-500 font-['Roboto'] text-sm leading-[14px] mt-2">
                        ServerIcon ID: SRV-042
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangleIcon className="w-4 h-4 text-amber-700 mr-3" />
                    <div>
                      <p className="text-amber-700 font-['Roboto'] text-base leading-4">
                        Storage Space Warning
                      </p>
                      <p className="text-amber-500 font-['Roboto'] text-sm leading-[14px] mt-2">
                        85% capacity reached
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-500 font-['Roboto'] text-base leading-4 mb-4">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-[#004a7c] hover:bg-[#003a6c] h-10 rounded-lg">
                    <RotateCwIcon className="w-4 h-4 mr-2" />
                    Restart ServerIcon
                  </Button>
                  <Button className="bg-[#00a9e0] hover:bg-[#0099d0] h-10 rounded-lg">
                    <Trash2Icon className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default AdminSystemOverviewBody;
