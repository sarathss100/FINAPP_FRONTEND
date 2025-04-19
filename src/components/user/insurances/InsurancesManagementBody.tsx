import {
  ArrowRightIcon,
  ArrowUpIcon,
  EyeIcon,
  HistoryIcon,
  PlusCircleIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Image from 'next/image';

// Insurance card data for mapping
const insuranceCards = [
  {
    id: 1,
    type: "Health Insurance",
    coverage: "$500,000",
    nextPayment: "15 Mar",
    iconSrc: "/heart_blue_icon.svg",
    status: "Active",
  },
  {
    id: 2,
    type: "Term Insurance",
    coverage: "$1,000,000",
    nextPayment: "22 Mar",
    iconSrc: "/time_blue_icon.svg",
    status: "Active",
  },
  {
    id: 3,
    type: "Life Insurance",
    coverage: "$2,000,000",
    nextPayment: "1 Apr",
    iconSrc: "/user_blue_icon.svg",
    status: "Active",
  },
  {
    id: 4,
    type: "Vehicle Insurance",
    coverage: "$50,000",
    nextPayment: "10 Mar",
    iconSrc: "/car_blue_icon.svg",
    status: "Active",
  },
  {
    id: 5,
    type: "Home Insurance",
    coverage: "$300,000",
    nextPayment: "5 Apr",
    iconSrc: "/home_blue_icon.svg",
    status: "Active",
  },
  {
    id: 6,
    type: "Property Insurance",
    coverage: "$800,000",
    nextPayment: "20 Mar",
    iconSrc: "/building_blue_icon.svg",
    status: "Active",
  },
  {
    id: 7,
    type: "Investment Insurance",
    coverage: "$100,000",
    nextPayment: "12 Apr",
    iconSrc: "/growth_chart_blue_icon.svg",
    status: "Active",
  },
  {
    id: 8,
    type: "Shop Insurance",
    coverage: "$200,000",
    nextPayment: "28 Mar",
    iconSrc: "/shop_blue_icon.svg",
    status: "Active",
  },
];

// Quick actions data
const quickActions = [
  {
    id: 1,
    title: "Add New Policy",
    icon: <PlusCircleIcon className="w-3.5 h-4" />,
  },
  {
    id: 2,
    title: "View Claims",
    icon: <EyeIcon className="w-3 h-4" />,
  },
  {
    id: 3,
    title: "Payment History",
    icon: <HistoryIcon className="w-4 h-4" />,
  },
];

// Summary data
const summaryItems = [
  {
    id: 1,
    title: "Total Policies",
    value: "13",
    iconSrc: "/document_blue_icon.svg",
  },
  {
    id: 2,
    title: "Total Premium",
    value: "$18,460/yr",
    iconSrc: "/cash_darkblue_icon.svg",
  },
  {
    id: 3,
    title: "Next Payment",
    value: "Mar 15, 2025",
    iconSrc: "/calendar_darkblue_icon.svg",
  },
];

const InsuranceManagementBody = function () {
  return (
    <main className="container mx-auto p-8 max-w-7xl">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Insurance Management`} tag={`Manage All your insurance on one place`} />

      {/* Page title and actions */}
      <section className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Button className="bg-[#00a9e0] hover:bg-[#0090c0] text-white flex items-center gap-2 h-[42px]">
            <PlusIcon className="w-3.5 h-4" />
            <span>Add Insurance</span>
          </Button>

          <Button
            variant="outline"
            className="border-[#004a7c] text-[#004a7c] flex items-center gap-2 h-[42px]"
          >
            <StarIcon className="w-4 h-4" />
            <span>Import/Export</span>
          </Button>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#004a7c] text-white rounded-xl border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-normal mb-4">
              Total Insurance Coverage
            </h2>
            <p className="text-3xl font-normal mb-4">₹24,56,789</p>
            <div className="flex items-center">
              <ArrowUpIcon className="w-[18px] h-4 text-[#00a9e0]" />
              <span className="ml-2 text-[#00a9e0]">+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00a9e0] text-white rounded-xl border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-normal mb-4">
              Total Annual Premium paid
            </h2>
            <p className="text-3xl font-normal mb-4">₹3,45,678</p>
            <div className="flex items-center">
              <Image src="/growth_chart_blue_icon.svg" alt="Arrow up" width={16} height={16} />
              <span className="ml-2">+8.2% overall returns</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Insurance cards grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {insuranceCards.map((card) => (
          <Card
            key={card.id}
            className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Image
                  src={card.iconSrc}
                  alt={card.type}
                  height={30}
                  width={30}
                />
                <Badge className="bg-[#00a9e01a] text-[#00a9e0] font-normal font-['Montserrat',Helvetica] text-sm px-3 py-1 rounded-full">
                  {card.status}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-4">
                {card.type}
              </h3>

              <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica] mb-4">
                Coverage: {card.coverage}
              </p>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 font-normal font-['Montserrat',Helvetica]">
                  Next Payment: {card.nextPayment}
                </p>
                <ArrowRightIcon className="w-3.5 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick actions */}
      <section className="mb-8">
        <Card className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  className="bg-[#00a9e01a] text-[#004a7c] h-12 flex items-center justify-center gap-2 hover:bg-[#00a9e033]"
                >
                  {action.icon}
                  <span className="font-normal font-['Montserrat',Helvetica] text-base">
                    {action.title}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Insurance summary */}
      <section>
        <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d]">
          <CardContent className="p-6">
            <h2 className="text-xl font-normal text-[#004a7c] font-['Poppins',Helvetica] mb-6">
              Insurance Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summaryItems.map((item) => (
                <div key={item.id} className="bg-[#004a7c0d] rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Image
                      src={item.iconSrc}
                      alt={item.title}
                      className="mr-2"
                      width={16}
                      height={16}
                    />
                    <span className="text-base text-gray-600 font-normal font-['Poppins',Helvetica]">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-2xl text-[#004a7c] font-normal font-['Poppins',Helvetica]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default InsuranceManagementBody;
