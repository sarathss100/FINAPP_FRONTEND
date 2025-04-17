import { PlusIcon } from "lucide-react";
import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Progress } from '@/components/base/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';
import Image from 'next/image';

// Define data for reusable components
const summaryCards = [
  {
    title: "Total Debt Amount",
    value: "$45,280",
    indicator: {
      text: "2.4% from last month",
      color: "text-red-500",
      icon: "/growth_green_up_icon.svg",
    },
  },
  {
    title: "Monthly Payment Rate",
    value: "$1,200",
    indicator: {
      text: "$200 more than minimum",
      color: "text-emerald-500",
      icon: "/growth_green_up_icon.svg",
    },
  },
  {
    title: "Left to Pay",
    value: "$42,080",
    progress: { value: 111, max: 246 },
  },
  {
    title: "Time to Debt-Free",
    value: "3.2 years",
    subtext: "At current payment rate",
  },
];

const goodDebts = [
  { name: "Mortgage Loan", interest: "3.5% Interest", amount: "$32,000" },
  { name: "Student Loan", interest: "4.2% Interest", amount: "$8,500" },
];

const badDebts = [
  { name: "Credit Card A", interest: "19.99% Interest", amount: "$3,200" },
  { name: "Personal Loan", interest: "12.5% Interest", amount: "$1,580" },
];

const debtList = [
  {
    type: "Credit Card A",
    amount: "$3,200",
    interestRate: "19.99%",
    interestColor: "text-red-500",
    monthlyPayment: "$300",
    status: "In Progress",
    statusColor: "bg-amber-100 text-amber-800",
  },
  {
    type: "Personal Loan",
    amount: "$1,580",
    interestRate: "12.5%",
    interestColor: "text-orange-500",
    monthlyPayment: "$200",
    status: "On Track",
    statusColor: "bg-emerald-100 text-emerald-800",
  },
];

const approachResults = [
  {
    title: "High Interest Rate Approach",
    description:
      "Focus on paying off debts with the highest interest rates first while making minimum payments on others.",
    barColor: "bg-[#00a9e0]",
    barWidths: ["w-[479px]", "w-[399px]", "w-[319px]", "w-[239px]", "w-40"],
    results: {
      time: "32 months",
      interest: "Interest Saved: $4,280",
      payment: "$1,250",
    },
  },
  {
    title: "Snowball Effect Approach",
    description:
      "Start with the smallest debt first while making minimum payments on larger ones. Use the momentum to tackle bigger debts.",
    barColor: "bg-[#004a7c]",
    barWidths: ["w-40", "w-[239px]", "w-[319px]", "w-[399px]", "w-[479px]"],
    results: {
      time: "36 months",
      interest: "Interest Paid: $5,120",
      payment: "$1,250",
    },
  },
];

const DebtManagementSection = function () {
  return (
    <section className="w-full p-4">
      <div className="w-full max-w-[1280px] mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end mb-4">
          <Button className="mr-3 bg-[#00a9e0] text-white hover:bg-[#0090c0]">
            <PlusIcon className="w-3.5 h-4 mr-2" />
            Add Debt
          </Button>
          <Button variant="outline" className="border-[#004a7c] text-[#004a7c]">
            <Image className="mr-2" alt="Frame" src="/export_import_icon.svg" width={16} height={16} />
            Import/Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className="shadow-[0px_1px_2px_#0000000d] bg-white"
            >
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 font-['Roboto',Helvetica]">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold text-[#004a7c] mt-4 font-['Roboto',Helvetica]">
                  {card.value}
                </h3>
                {card.indicator && (
                  <div className="flex items-center mt-4">
                    <Image
                      alt="Indicator"
                      src={card.indicator.icon}
                      width={10}
                      height={14}
                    />
                    <span
                      className={`text-sm ml-2.5 ${card.indicator.color} font-['Roboto',Helvetica]`}
                    >
                      {card.indicator.text}
                    </span>
                  </div>
                )}
                {card.progress && (
                  <Progress
                    className="h-2.5 mt-4 bg-gray-200 rounded-full"
                    value={card.progress.value}
                    max={card.progress.max}
                  />
                )}
                {card.subtext && (
                  <p className="text-sm text-gray-500 mt-4 font-['Roboto',Helvetica]">
                    {card.subtext}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Debt Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Good Debt */}
          <Card className="shadow-[0px_1px_2px_#0000000d] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-[#004a7c] font-['Roboto',Helvetica]">
                Good Debt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goodDebts.map((debt, index) => (
                  <div
                    key={index}
                    className="bg-emerald-50 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-base font-medium text-black font-['Roboto',Helvetica]">
                        {debt.name}
                      </p>
                      <p className="text-sm text-gray-500 font-['Roboto',Helvetica]">
                        {debt.interest}
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-black font-['Roboto',Helvetica]">
                      {debt.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bad Debt */}
          <Card className="shadow-[0px_1px_2px_#0000000d] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-[#004a7c] font-['Roboto',Helvetica]">
                Bad Debt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {badDebts.map((debt, index) => (
                  <div
                    key={index}
                    className="bg-red-50 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-base font-medium text-black font-['Roboto',Helvetica]">
                        {debt.name}
                      </p>
                      <p className="text-sm text-gray-500 font-['Roboto',Helvetica]">
                        {debt.interest}
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-black font-['Roboto',Helvetica]">
                      {debt.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debt List Table */}
        <Card className="mb-8 shadow-[0px_1px_2px_#0000000d] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-[#004a7c] font-['Roboto',Helvetica]">
              Debt List by Interest Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-xs text-gray-500 tracking-[0.60px] font-['Roboto',Helvetica]">
                    Debt Type
                  </TableHead>
                  <TableHead className="font-medium text-xs text-gray-500 tracking-[0.60px] font-['Roboto',Helvetica]">
                    Amount
                  </TableHead>
                  <TableHead className="font-medium text-xs text-gray-500 tracking-[0.60px] font-['Roboto',Helvetica]">
                    Interest Rate
                  </TableHead>
                  <TableHead className="font-medium text-xs text-gray-500 tracking-[0.60px] font-['Roboto',Helvetica]">
                    Monthly Payment
                  </TableHead>
                  <TableHead className="font-medium text-xs text-gray-500 tracking-[0.60px] font-['Roboto',Helvetica]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtList.map((debt, index) => (
                  <TableRow key={index} className={index > 0 ? "border-t" : ""}>
                    <TableCell className="py-4 font-normal text-base text-black font-['Roboto',Helvetica]">
                      {debt.type}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-base text-black font-['Roboto',Helvetica]">
                      {debt.amount}
                    </TableCell>
                    <TableCell
                      className={`py-4 font-normal text-base ${debt.interestColor} font-['Roboto',Helvetica]`}
                    >
                      {debt.interestRate}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-base text-black font-['Roboto',Helvetica]">
                      {debt.monthlyPayment}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={`rounded-full px-2 py-1 ${debt.statusColor} font-normal text-xs font-['Roboto',Helvetica]`}
                      >
                        {debt.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Debt Repayment Approaches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {approachResults.map((approach, index) => (
            <Card
              key={index}
              className="shadow-[0px_1px_2px_#0000000d] bg-white"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-[#004a7c] font-['Roboto',Helvetica]">
                  {approach.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Visualization */}
                <div className="bg-neutral-100 rounded-lg p-4 h-64 mb-4">
                  <div className="flex flex-col space-y-4 pt-[72px]">
                    {approach.barWidths.map((width, i) => (
                      <div
                        key={i}
                        className={`h-4 rounded-full ${approach.barColor} ${width}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-gray-600 mb-4 font-['Roboto',Helvetica]">
                  {approach.description}
                </p>

                {/* Results */}
                <div className="bg-neutral-100 rounded-lg p-4">
                  <p className="text-base text-[#004a7c] mb-4 font-['Poppins',Helvetica]">
                    Projected Results:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Image
                        alt="Time icon"
                        src="/calendar_icon.svg"
                        width={14}
                        height={16}
                      />
                      <span className="ml-4 text-base text-black font-['Poppins',Helvetica]">
                        Total Time: {approach.results.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Image
                        className="w-[18px] h-4"
                        alt="Interest icon"
                        src="/cash_icon.svg"
                        width={18}
                        height={14}
                      />
                      <span className="ml-2 text-base text-black font-['Poppins',Helvetica]">
                        {approach.results.interest}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Image
                        alt="Payment icon"
                        src="/growth_chart_blue_icon.svg"
                        height={16}
                        width={16}
                      />
                      <span className="ml-2 text-base text-black font-['Poppins',Helvetica]">
                        Monthly Payment: {approach.results.payment}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DebtManagementSection;
