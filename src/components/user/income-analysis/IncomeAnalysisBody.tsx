import { PlusIcon } from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/base/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/select';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Image from 'next/image';

const IncomeAnalysisBody = function () {
  // Transaction data
  const transactions = [
    {
      id: 1,
      name: "Hotel Business",
      date: "Today, 2:30 PM",
      amount: "+$3,500.00",
      icon: "/hotel_blue_icon.svg",
    },
    {
      id: 2,
      name: "Business Profit",
      date: "Yesterday",
      amount: "+$3,500.00",
      icon: "/shopping_blue_icon.svg",
    },
    {
      id: 3,
      name: "Salary Deposit",
      date: "Mar 1, 2025",
      amount: "+$3,500.00",
      icon: "/bank_blue_icon.svg",
    },
  ];

  // Income sources data
  const incomeSources = [
    { name: "XYZ Bank", amount: "$485" },
    { name: "FD", amount: "$890" },
    { name: "Rent", amount: "$120" },
  ];

  // Recurring incomes data
  const recurringIncomes = [
    { name: "Business", schedule: "Monthly • 5th", amount: "$59.99" },
    { name: "Rent", schedule: "Monthly • 15th", amount: "$9.99" },
  ];

  // Monthly contribution data
  const contributionData = [
    {
      name: "Business Income",
      percentage: "75%",
      value: 75,
      color: "bg-emerald-500",
    },
    {
      name: "Salary Income",
      percentage: "45%",
      value: 45,
      color: "bg-blue-500",
    },
    {
      name: "Interest Income",
      percentage: "60%",
      value: 60,
      color: "bg-violet-500",
    },
    {
      name: "Return on Investment",
      percentage: "90%",
      value: 90,
      color: "bg-amber-500",
    },
  ];

  return (
    <main className="max-w-[1184px] mx-auto p-8">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Income Sources`} tag={`Income Transaction History`} />

      {/* Main Content */}
      <div className="space-y-8">
        {/* Transactions Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90">
                <PlusIcon className="mr-2 h-3.5 w-3.5" />
                Add Transaction
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Transactions List */}
            <div className="flex-1">
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Input
                        className="h-[42px]"
                        placeholder="SearchIcon transactions..."
                      />
                    </div>
                    <Select defaultValue="all-categories">
                      <SelectTrigger className="w-[289px] h-[43px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">
                          All Categories
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="last-30-days">
                      <SelectTrigger className="w-[157px] h-[43px]">
                        <SelectValue placeholder="Last 30 Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-30-days">
                          Last 30 Days
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 py-4 border-b">
                  <CardTitle className="text-lg text-[#004a7c]">
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {transactions.map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className={`p-4 flex justify-between items-center ${
                        index !== transactions.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#00a9e01a] flex items-center justify-center mr-4">
                          <Image
                            src={transaction.icon}
                            alt=""
                            width={16}
                            height={16}
                          />
                        </div>
                        <div>
                          <p className="text-base">{transaction.name}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <span className="text-emerald-500">
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                </CardContent>
                <div className="p-4 flex justify-between items-center">
                  <p className="text-gray-600 text-base">
                    Showing 5 of 125 entries
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </Card>
            </div>

            {/* Side Panels */}
            <div className="w-[294px] space-y-6">
              {/* Income Sources Panel */}
              <Card>
                <CardHeader className="px-4 py-4 border-b flex justify-between items-center">
                  <CardTitle className="text-lg text-[#004a7c]">
                    Income <br />
                    Sources
                  </CardTitle>
                  <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90 h-[42px]">
                    <PlusIcon className="mr-2 h-3.5 w-3.5" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  {incomeSources.map((source, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-4"
                    >
                      <div className="flex items-center">
                        <span className="ml-6">{source.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {source.amount}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recurring Incomes Panel */}
              <Card>
                <CardHeader className="px-4 py-4 border-b flex justify-between items-center">
                  <CardTitle className="text-lg text-[#004a7c]">
                    Recurring <br />
                    Incomes
                  </CardTitle>
                  <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90 h-[42px]">
                    <PlusIcon className="mr-2 h-3.5 w-3.5" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  {recurringIncomes.map((income, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-4"
                    >
                      <div className="flex items-center">
                        <div className="ml-7">
                          <p className="text-base">{income.name}</p>
                          <p className="text-sm text-gray-500">
                            {income.schedule}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm">{income.amount}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex gap-6">
          {/* Monthly Contribution Percentages */}
          <Card className="flex-1">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Monthly Contribution Percentages
              </h3>
              <div className="space-y-6">
                {contributionData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-medium">
                        {item.percentage}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div
                        className={`h-2.5 rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yearly Contribution Map */}
          <Card className="flex-1">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Yearly Contribution Map
              </h3>
              <div className="h-[335px] w-full">
                <Image
                  className="w-full h-full object-cover"
                  alt="Yearly Contribution Map"
                  src="/image-2.png"
                  width={100}
                  height={100}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default IncomeAnalysisBody;
