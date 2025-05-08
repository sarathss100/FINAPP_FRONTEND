import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Image from 'next/image';
import Link from 'next/link';

const InsightsSection = function () {
  // Budget data
  const budgetCategories = [
    { name: "Shopping", percentage: 75 },
    { name: "Bills", percentage: 45 },
    { name: "Entertainment", percentage: 90 },
    { name: "Budget Amount Left", percentage: 50 },
  ];

  // Recent transactions data
  const transactions = [
    {
      name: "Amazon",
      category: "Shopping",
      amount: "-$120",
      color: "bg-blue-100",
      textColor: "text-red-500",
      icon: "/shopping_bag_icon.svg",
    },
    {
      name: "Salary",
      category: "Deposit",
      amount: "+$4,500",
      color: "bg-emerald-100",
      textColor: "text-emerald-500",
      icon: "/arrow_down_icon.svg",
    },
    {
      name: "Restaurant",
      category: "Food",
      amount: "-$45",
      color: "bg-red-100",
      textColor: "text-red-500",
      icon: "/food_icon.svg",
    },
  ];

  // Debt overview data
  const debtCategories = [
    { name: "Home Loan", percentage: 10 },
    { name: "Car Loan", percentage: 45 },
    { name: "Credit Cards", percentage: 90 },
    { name: "Personal Loan", percentage: 50 },
  ];

  // Income overview data
  const incomeCategories = [
    { name: "Salary", percentage: 10 },
    { name: "Bank Interests", percentage: 45 },
    { name: "Investment Returns", percentage: 90 },
    { name: "Property Rent", percentage: 50 },
  ];

  // Insurance overview data
  const insuranceCategories = [
    { name: "Health Insurance", percentage: 10 },
    { name: "Term Insurance", percentage: 45 },
    { name: "Life Insurance", percentage: 90 },
    { name: "Vehicle Insurance", percentage: 50 },
  ];

  // Bank accounts data
  const bankAccounts = [
    {
      name: "Chase Bank",
      accountType: "Checking **** 1234",
      balance: "$12,450.00",
      icon: "/bank_icon.svg",
    },
    {
      name: "Bank of America",
      accountType: "Savings **** 5678",
      balance: "$32,800.00",
      icon: "/bank_icon.svg",
    },
  ];

  // Smart insights data
  const smartInsights = [
    {
      title: "Spending Pattern",
      description:
        "Your shopping expenses increased by 15% this month. Consider reviewing your budget.",
      bgColor: "bg-blue-50",
      icon: "/growth_icon.svg",
    },
    {
      title: "Savings Opportunity",
      description:
        "You can save $200 more this month by reducing entertainment expenses.",
      bgColor: "bg-emerald-50",
      icon: "/piggy_icon.svg",
    },
    {
      title: "Investment Tracking",
      description:
        "Consider diversifying your portfolio with ETFs for better long-term returns.",
      bgColor: "bg-violet-50",
      icon: "/growth_chart_icon.svg",
    },
  ];

  return (
    <section className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Budget Overview Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgetCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.name}
                    </span>
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-[#00a9e0] rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${transaction.color} flex items-center justify-center`}
                    >
                      <div className="relative flex items-center justify-center">
                        <Image
                          className="relative"
                          alt="Icon"
                          src={transaction.icon}
                          width={14}
                          height={16}
                        />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-normal [font-family:'Poppins',Helvetica]">
                        {transaction.name}
                      </div>
                      <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                        {transaction.category}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${transaction.textColor} text-base font-normal [font-family:'Poppins',Helvetica]`}
                  >
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Total Goal Progress Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Total Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full border-8 border-solid border-[#00a9e0] flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="text-2xl font-normal [font-family:'Poppins',Helvetica]">
                    75%
                  </div>
                  <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                    Vacation Fund
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Current: $3,750</span>
                  <span>Goal: $5,000</span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 w-[75%] bg-[#00a9e0] rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Fund Progress Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Emergency Fund Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full border-8 border-solid border-[#00a9e0] flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="text-2xl font-normal [font-family:'Poppins',Helvetica]">
                    100%
                  </div>
                  <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                    Emergency Fund
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Current: $3,750</span>
                  <span>Goal: $5,000</span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 w-[75%] bg-[#00a9e0] rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debt Overview Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Debt Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {debtCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.name}
                    </span>
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-[#00a9e0] rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income Overview Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Income Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {incomeCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.name}
                    </span>
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-[#00a9e0] rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica] text-[#004a7c]">
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bankAccounts.map((account, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center">
                      <Image alt="Icon" src={account.icon} width={16} height={16} />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-normal [font-family:'Poppins',Helvetica]">
                        {account.name}
                      </div>
                      <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                        {account.accountType}
                      </div>
                    </div>
                  </div>
                  <div className="text-base font-normal [font-family:'Poppins',Helvetica]">
                    {account.balance}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Overview Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Tax Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full border-8 border-solid border-[#00a9e0] flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="text-2xl font-normal [font-family:'Poppins',Helvetica]">
                    0%
                  </div>
                  <div className="text-sm text-gray-500 font-normal [font-family:'Poppins',Helvetica]">
                    Taxable
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-normal [font-family:'Poppins',Helvetica]">
                  <span>Current: $3,750</span>
                  <span>Tax: $0</span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 w-[75%] bg-[#00a9e0] rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Overview Card */}
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
              Insurance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {insuranceCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.name}
                    </span>
                    <span className="text-base font-normal [font-family:'Poppins',Helvetica]">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-[#00a9e0] rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Behavior Score Section */}
      <Link href={'/spending-behavior-score-details'} passHref >
      <Card className="mt-6 shadow-[0px_1px_2px_#0000000d] rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-normal [font-family:'Poppins',Helvetica] text-[#004a7c]">
            Spending Behavior Score
          </CardTitle>
          <p className="text-base font-normal [font-family:'Poppins',Helvetica] text-gray-600">
            Understand your financial personality based on your spending
            patterns
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="text-base font-normal [font-family:'Poppins',Helvetica] text-amber-700">
              10-14 Points: Good Progress
            </h3>
            <p className="text-base font-normal [font-family:'Poppins',Helvetica] text-gray-700 mt-2">
              You`&apos`re on the right track with balanced financial habits. Continue
              to build your emergency fund and work on increasing your savings
              rate.
            </p>
          </div>
        </CardContent>
        </Card>
        </Link>

      {/* Smart Insights Section */}
      <Card className="mt-6 shadow-[0px_1px_2px_#0000000d] rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-normal [font-family:'Poppins',Helvetica]">
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {smartInsights.map((insight, index) => (
              <div key={index} className={`${insight.bgColor} rounded-lg p-4`}>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center">
                    <Image alt="Icon" src={insight.icon} height={16} width={16} />
                  </div>
                  <h3 className="ml-2 text-base font-normal [font-family:'Poppins',Helvetica]">
                    {insight.title}
                  </h3>
                </div>
                <p className="text-sm font-normal [font-family:'Poppins',Helvetica] text-gray-600">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default InsightsSection;
