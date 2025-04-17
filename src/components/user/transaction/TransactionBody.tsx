import { ChevronDownIcon } from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/base/Table';
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/base/pagination';
import Image from 'next/image';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';

const TransactionBody = function () {
  // Transaction data
  const transactions = [
    {
      id: 1,
      category: "Restaurant",
      date: "Today, 2:30 PM",
      amount: "-$42.50",
      amountColor: "text-red-500",
      icon: "/restaurant_icon.svg",
    },
    {
      id: 2,
      category: "Shopping Mall",
      date: "Yesterday",
      amount: "-$128.99",
      amountColor: "text-red-500",
      icon: "/shopping_bag_icon.svg",
    },
    {
      id: 3,
      category: "Salary Deposit",
      date: "Mar 1, 2025",
      amount: "+$3,500.00",
      amountColor: "text-emerald-500",
      icon: "/bank_icon.svg",
    },
  ];

  // Categories data
  const categories = [
    {
      id: 1,
      name: "Food & Dining",
      amount: "$485",
      icon: "/restaurant_icon.svg",
    },
    {
      id: 2,
      name: "Shopping",
      amount: "$890",
      icon: "/shopping_bag_icon.svg",
    },
    {
      id: 3,
      name: "Transport",
      amount: "$120",
      icon: "/transport_icon.svg",
    },
  ];

  // Recurring payments data
  const recurringPayments = [
    {
      id: 1,
      name: "Internet Bill",
      schedule: "Monthly • 5th",
      amount: "$59.99",
      icon: "/internet_icon.svg",
    },
    {
      id: 2,
      name: "Spotify",
      schedule: "Monthly • 15th",
      amount: "$9.99",
      icon: "/entertainment_icon.svg",
    },
  ];

  // Calendar data
  const calendarDays = [
    { day: "Sun", label: "31", current: false },
    {
      day: "Mon",
      label: "1",
      current: true,
      indicator: "bg-emerald-500",
      transactions: [{ amount: "+$2,500", color: "text-emerald-600" }],
    },
    {
      day: "Tue",
      label: "2",
      current: true,
      indicator: "bg-red-500",
      transactions: [{ amount: "-$150", color: "text-red-600" }],
    },
    {
      day: "Wed",
      label: "3",
      current: true,
      indicator: "bg-amber-500",
      transactions: [
        { amount: "+$800", color: "text-emerald-600" },
        { amount: "-$300", color: "text-red-600" },
      ],
    },
    { day: "Thu", label: "4", current: true },
    { day: "Fri", label: "5", current: true },
    { day: "Sat", label: "6", current: true },
    { day: "Sun", label: "7", current: true },
  ];

  // Summary cards data
  const summaryCards = [
    {
      title: "Total Income",
      amount: "$8,500",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      icon: "/growth_green_icon.svg",
    },
    {
      title: "Total Expenses",
      amount: "$3,200",
      color: "text-red-500",
      bgColor: "bg-red-100",
      icon: "/growth_down_red_icon.svg",
    },
    {
      title: "Net Balance",
      amount: "$5,300",
      color: "text-[#004a7c]",
      bgColor: "bg-[#00a9e033]",
      icon: "/wallet_blue_icon.svg",
    },
  ];

  return (
    <div className="w-full max-w-[1184px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`General Transactions`} tag={`General Transaction History`} />

      <div className="space-y-8">
        {/* General Transactions Section */}
        <section>
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-[#004a7c] font-normal">
                Transactions
              </h2>

              <div className="flex gap-4">
                <Button className="bg-[#00a9e0] text-white hover:bg-[#00a9e0]/90">
                  <Image
                    className="mr-2"
                    alt="Scan"
                    src="/plus_icon.svg"
                    width={14}
                    height={16}
                  />
                  Scan bills
                </Button>

                <Button className="bg-[#00a9e0] text-white hover:bg-[#00a9e0]/90">
                  <Image
                    className="mr-2"
                    alt="Add"
                    src="/plus_icon.svg"
                    width={14}
                    height={16}
                  />
                  Add Transaction
                </Button>

                <Button
                  variant="outline"
                  className="border-[#004a7c] text-[#004a7c]"
                >
                  <Image
                    className="mr-2"
                    alt="Import/Export"
                    src="/export_import_icon.svg"
                    width={16}
                    height={16}
                  />
                  Import/Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Transaction History */}
              <div className="col-span-2">
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="relative flex-1">
                        <Input
                          className="w-full h-[43px]"
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
                          <SelectItem value="food">Food & Dining</SelectItem>
                          <SelectItem value="shopping">Shopping</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
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
                          <SelectItem value="last-90-days">
                            Last 90 Days
                          </SelectItem>
                          <SelectItem value="this-year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 shadow-sm">
                  <CardHeader className="border-b px-4 py-4">
                    <CardTitle className="text-lg text-[#004a7c]">
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableBody>
                        {transactions.map((transaction, index) => (
                          <TableRow
                            key={transaction.id}
                            className={index !== 0 ? "border-t" : ""}
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#00a9e01a] flex items-center justify-center mr-4">
                                  <Image
                                    alt={transaction.category}
                                    src={transaction.icon}
                                    width={14}
                                    height={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-base font-normal">
                                    {transaction.category}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {transaction.date}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className={`text-right ${transaction.amountColor}`}
                            >
                              {transaction.amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* <div className="flex justify-between items-center mt-4">
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
                </div> */}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b px-4 py-4 flex justify-between items-center">
                    <CardTitle className="text-lg text-[#004a7c]">
                      Categories
                    </CardTitle>
                    <Button className="bg-[#00a9e0] text-white hover:bg-[#00a9e0]/90 h-[42px]">
                      <Image
                        className="mr-2"
                        alt="Add"
                        src="/plus_icon.svg"
                        width={14}
                        height={16}
                      />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex justify-between items-center mb-4 last:mb-0"
                      >
                        <div className="flex items-center">
                          <Image
                            className="mr-3"
                            alt={category.name}
                            src={category.icon}
                            width={14}
                            height={16}
                          />
                          <span className="text-base">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category.amount}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recurring Payments */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b px-4 py-4 flex justify-between items-center">
                    <CardTitle className="text-lg text-[#004a7c]">
                      Recurring <br />
                      Payments
                    </CardTitle>
                    <Button className="bg-[#00a9e0] text-white hover:bg-[#00a9e0]/90 h-[42px]">
                      <Image
                        className="mr-2"
                        alt="Add"
                        src="/plus_icon.svg"
                        width={14}
                        height={16}
                      />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    {recurringPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex justify-between items-center mb-4 last:mb-0"
                      >
                        <div className="flex items-center">
                          <Image
                            className="mr-3"
                            alt={payment.name}
                            src={payment.icon}
                            width={16}
                            height={16}
                          />
                          <div>
                            <p className="text-base">{payment.name}</p>
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
          </div>
        </section>

        {/* Financial Calendar Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004a7c]">
              Financial Calendar
            </h2>

            <Button variant="outline" className="bg-white shadow-sm h-10">
              January 2025
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Card className="shadow-sm mb-6">
            <CardContent className="p-4 flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Expense</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm text-gray-600">Both</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="text-center">
                      <span className="font-medium text-[#004a7c]">{day}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-4">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-lg p-2 h-32 relative"
                  >
                    <div className="flex justify-between">
                      <span
                        className={day.current ? "text-black" : "text-gray-400"}
                      >
                        {day.label}
                      </span>
                      {day.indicator && (
                        <div
                          className={`w-2 h-2 rounded-full ${day.indicator}`}
                        ></div>
                      )}
                    </div>

                    {day.transactions && (
                      <div className="mt-4 space-y-1">
                        {day.transactions.map((transaction, idx) => (
                          <div
                            key={idx}
                            className={`text-xs ${transaction.color}`}
                          >
                            {transaction.amount}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mr-4`}
                    >
                      <Image
                        alt={card.title}
                        src={card.icon}
                        width={18}
                        height={16}
                      />
                    </div>
                    <span className="text-base font-medium text-[#004a7c]">
                      {card.title}
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransactionBody;
