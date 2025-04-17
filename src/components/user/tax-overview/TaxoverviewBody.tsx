import { GraduationCapIcon, HomeIcon, ShieldIcon } from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from '@/components/base/Table';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Image from 'next/image';

// Data for tax summary cards
const taxSummaryCards = [
  {
    title: "Total Income",
    amount: "₹15,00,000",
    description: "For FY 2025-26",
    icon: "/cash_icon.svg",
  },
  {
    title: "Taxable Income",
    amount: "₹12,50,000",
    description: "After Deductions",
    icon: "/calculator_icon.svg",
  },
  {
    title: "Tax Payable",
    amount: "₹1,87,500",
    description: "Estimated Tax",
    icon: "/budget_blue_icon.svg",
  },
  {
    title: "Tax Saved",
    amount: "₹45,000",
    description: "Through Deductions",
    icon: "/piggy_blue_icon.svg",
    amountColor: "text-emerald-500",
  },
];

// Data for tax optimization opportunities
const taxOptimizationItems = [
  {
    title: "HomeIcon Loan Interest",
    savings: "Save up to ₹50,000",
    icon: <HomeIcon className="w-4 h-4 text-[#004a7c]" />,
  },
  {
    title: "Health Insurance",
    savings: "Save up to ₹25,000",
    icon: <ShieldIcon className="w-4 h-4 text-[#004a7c]" />,
  },
  {
    title: "Education Investment",
    savings: "Save up to ₹35,000",
    icon: <GraduationCapIcon className="w-5 h-4 text-[#004a7c]" />,
  },
];

// Data for tax regimes
const taxRegimes = [
  {
    name: "Current Regime",
    amount: "₹1,87,500",
    progressWidth: "w-[398px]",
  },
  {
    name: "New Regime",
    amount: "₹1,65,000",
    progressWidth: "w-[344px]",
  },
];

// Data for tax breakdown table
const taxBreakdownData = [
  {
    source: "Salary Income",
    amount: "₹12,00,000",
    rate: "20%",
    taxAmount: "₹1,50,000",
  },
  {
    source: "Rental Income",
    amount: "₹2,00,000",
    rate: "10%",
    taxAmount: "₹20,000",
  },
  {
    source: "Investment Income",
    amount: "₹1,00,000",
    rate: "15%",
    taxAmount: "₹17,500",
  },
];

export const TaxoverviewBody = function () {
  return (
    <main className="max-w-[1187px] mx-auto py-8">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Tax Overview`} tag={`This is an overview of potential income tax`} />

      {/* Tax Overview Section */}
      <section className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div></div>
          <Button className="h-[42px] border border-[#004a7c] text-[#004a7c] bg-white hover:bg-gray-50">
            <Image
              className="mr-2"
              alt="Import/Export icon"
              src="/export_import_icon.svg"
              width={16}
              height={16}
            />
            Import/Export
          </Button>
        </div>
      </section>

      {/* Tax Details Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#004a7c] font-['Roboto',Helvetica] mb-2">
            Tax Details
          </h2>
          <p className="text-base text-gray-600 font-normal font-['Roboto',Helvetica]">
            Financial Year 2025-2026
          </p>
        </div>

        {/* Tax Summary Cards */}
        <div className="grid grid-cols-4 gap-5 mb-12">
          {taxSummaryCards.map((card, index) => (
            <Card key={index} className="shadow-[0px_1px_2px_#0000000d]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-base text-[#004a7c] font-['Roboto',Helvetica]">
                    {card.title}
                  </h3>
                  <Image
                    alt={`${card.title} icon`}
                    src={card.icon}
                    width={18}
                    height={16}
                  />
                </div>
                <p
                  className={`text-2xl font-bold ${card.amountColor || "text-[#004a7c]"} font-['Roboto',Helvetica] mb-2`}
                >
                  {card.amount}
                </p>
                <p className="text-sm text-gray-500 font-normal font-['Roboto',Helvetica]">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tax Optimization and Scenario Planning */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Tax Optimization Opportunities */}
          <Card className="shadow-[0px_1px_2px_#0000000d]">
            <CardHeader className="pb-0 pt-6">
              <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
                Tax Optimization Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {taxOptimizationItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-blue-50 rounded-lg p-3"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3 font-normal text-base text-[#004a7c] font-['Roboto',Helvetica]">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-semibold text-base text-emerald-500 font-['Roboto',Helvetica]">
                      {item.savings}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tax Scenario Planning */}
          <Card className="shadow-[0px_1px_2px_#0000000d]">
            <CardHeader className="pb-0 pt-6">
              <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
                Tax Scenario Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {taxRegimes.map((regime, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold text-base text-[#004a7c] font-['Roboto',Helvetica]">
                        {regime.name}
                      </span>
                      <span className="font-bold text-base text-[#00a9e0] font-['Roboto',Helvetica]">
                        {regime.amount}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 bg-[#00a9e0] rounded-full ${regime.progressWidth}`}
                      />
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-[#004a7c] hover:bg-[#003a6c] text-white font-normal text-base font-['Roboto',Helvetica] mt-4">
                  Compare Tax Regimes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Breakdown */}
        <Card className="shadow-[0px_1px_2px_#0000000d]">
          <CardHeader className="pb-0 pt-6">
            <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
              Tax Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-left font-bold text-base text-[#004a7c] font-['Roboto',Helvetica]">
                    Income Source
                  </TableHead>
                  <TableHead className="text-right font-bold text-base text-[#004a7c] font-['Roboto',Helvetica]">
                    Amount
                  </TableHead>
                  <TableHead className="text-right font-bold text-base text-[#004a7c] font-['Roboto',Helvetica]">
                    Tax Rate
                  </TableHead>
                  <TableHead className="text-right font-bold text-base text-[#004a7c] font-['Roboto',Helvetica]">
                    Tax Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxBreakdownData.map((row, index) => (
                  <TableRow key={index} className="border-b">
                    <TableCell className="font-normal text-base text-black font-['Roboto',Helvetica]">
                      {row.source}
                    </TableCell>
                    <TableCell className="text-right font-normal text-base text-black font-['Roboto',Helvetica]">
                      {row.amount}
                    </TableCell>
                    <TableCell className="text-right font-normal text-base text-black font-['Roboto',Helvetica]">
                      {row.rate}
                    </TableCell>
                    <TableCell className="text-right font-normal text-base text-black font-['Roboto',Helvetica]">
                      {row.taxAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default TaxoverviewBody;
