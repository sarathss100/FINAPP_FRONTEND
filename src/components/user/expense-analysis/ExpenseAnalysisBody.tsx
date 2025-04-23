import { PlusIcon } from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/base/pagination';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/base/select';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Image from 'next/image';

// Transaction data
const transactions = [
  {
    id: 1,
    category: "Hotel",
    date: "Today, 2:30 PM",
    amount: "-$128.99",
    icon: "/hotel_blue_icon.svg",
  },
  {
    id: 2,
    category: "Shopping",
    date: "Yesterday",
    amount: "-$128.99",
    icon: "/shopping_blue_icon.svg",
  },
  {
    id: 3,
    category: "Bank Fee",
    date: "Mar 1, 2025",
    amount: "-$128.99",
    icon: "/bank_blue_icon.svg",
  },
];

// Categories data
const categories = [
  {
    name: "Food & Dining",
    amount: "$485",
    icon: "/hotel_blue_icon.svg",
  },
  {
    name: "Shopping",
    amount: "$890",
    icon: "/shopping_blue_icon.svg",
  },
  {
    name: "Transport",
    amount: "$120",
    icon: "/car_blue_icon.svg",
  },
];

// Recurring payments data
const recurringPayments = [
  {
    name: "Internet Bill",
    schedule: "Monthly • 5th",
    amount: "$59.99",
    icon: "/internet_icon.svg",
  },
  {
    name: "Spotify",
    schedule: "Monthly • 15th",
    amount: "$9.99",
    icon: "/music_blue_icon.svg",
  },
];

// Contribution percentages data
const contributionPercentages = [
  {
    name: "Home Expenses",
    percentage: 75,
    color: "bg-emerald-500",
    width: "w-[75%]",
  },
  {
    name: "Entertainment Expense",
    percentage: 45,
    color: "bg-blue-500",
    width: "w-[45%]",
  },
  {
    name: "Loan Expense",
    percentage: 60,
    color: "bg-violet-500",
    width: "w-[60%]",
  },
  {
    name: "Other Expense",
    percentage: 90,
    color: "bg-amber-500",
    width: "w-[90%]",
  },
];

const ExpenseAnalysisBody = function () {
  return (
    <main className="container mx-auto p-8 max-w-7xl">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Expense Analysis`} tag={`Expense Transaction History`} />

      {/* Main content */}
      <div className="space-y-8">
        {/* Transactions section */}
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-[#004a7c]">Transactions</h2>
            <div className="flex gap-4">
              <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90">
                <PlusIcon className="mr-2 h-3.5 w-3.5" />
                Scan bills
              </Button>
              <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90">
                <PlusIcon className="mr-2 h-3.5 w-3.5" />
                Add Transaction
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Transaction history card */}
            <Card className="col-span-3 shadow-sm">
              <CardContent className="p-0">
                {/* Filters */}
                <div className="p-4 bg-white rounded-t-xl shadow-sm">
                  <div className="flex gap-4">
                    <Input
                      className="w-[289px]"
                      placeholder="SearchIcon transactions..."
                    />
                    <Select>
                      <SelectTrigger className="w-[289px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <div>All Categories</div>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[157px]">
                        <SelectValue placeholder="Last 30 Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <div>Last 30 Days</div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Transaction list */}
                <div className="bg-white rounded-b-xl">
                  <div className="border-b p-4">
                    <h3 className="text-lg text-[#004a7c]">
                      Transaction History
                    </h3>
                  </div>

                  <div>
                    {transactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className={`p-4 ${index !== 0 ? "border-t" : ""}`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#00a9e01a] flex items-center justify-center mr-4">
                              <Image
                                src={transaction.icon}
                                alt={transaction.category}
                                width={14}
                                height={16}
                              />
                            </div>
                            <div>
                              <p className="text-base">
                                {transaction.category}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.date}
                              </p>
                            </div>
                          </div>
                          <span className="text-red-500">
                            {transaction.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-600">Showing 5 of 125 entries</p>
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
              </CardContent>
            </Card>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Categories card */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                  <CardTitle className="text-lg text-[#004a7c]">
                    Categories
                  </CardTitle>
                  <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90">
                    <PlusIcon className="mr-2 h-3.5 w-3.5" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Image
                          src={category.icon}
                          alt={category.name}
                          className="mr-2"
                          width={14}
                          height={16}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {category.amount}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recurring payments card */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                  <CardTitle className="text-lg text-[#004a7c]">
                    Recurring <br />
                    Payments
                  </CardTitle>
                  <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90">
                    <PlusIcon className="mr-2 h-3.5 w-3.5" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {recurringPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Image
                          src={payment.icon}
                          alt={payment.name}
                          className="mr-2"
                          width={16}
                          height={16}
                        />
                        <div>
                          <p>{payment.name}</p>
                          <p className="text-sm text-gray-500">
                            {payment.schedule}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm">{payment.amount}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Bottom charts section */}
        <section className="grid grid-cols-2 gap-6">
          {/* Monthly Contribution Percentages */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Monthly Contribution Percentages
              </h3>
              <div className="space-y-6">
                {contributionPercentages.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-medium">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div
                        className={`h-2.5 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yearly Contribution Map */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Yearly Contribution Map
              </h3>
              <Image
                src="/image-2.png"
                alt="Yearly Contribution Map"
                className="object-cover"
                width={335}
                height={335}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default ExpenseAnalysisBody;
