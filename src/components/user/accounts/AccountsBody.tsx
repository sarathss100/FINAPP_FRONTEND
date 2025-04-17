import {
  ChevronRightIcon,
  CreditCardIcon,
  LandmarkIcon,
  PlusCircleIcon,
  TargetIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import PageTitle from '../base/PageTitle';
import UserHeader from '../base/Header';
import Image from 'next/image';

const AccountsBody = function () {
  // Bank accounts data
  const bankAccounts = [
    {
      name: "Chase Bank",
      type: "Checking **** 1234",
      balance: "$12,450.00",
      icon: <LandmarkIcon className="w-4 h-4" />,
    },
    {
      name: "Bank of America",
      type: "Savings **** 5678",
      balance: "$32,800.00",
      icon: <LandmarkIcon className="w-4 h-4" />,
    },
  ];

  // Investment accounts data
  const investmentAccounts = [
    {
      name: "Vanguard 401(k)",
      type: "Retirement",
      balance: "$45,000.00",
      icon: <TrendingUpIcon className="w-4 h-4" />,
    },
    {
      name: "Fidelity Stocks",
      type: "Trading Account",
      balance: "$30,500.00",
      icon: <TrendingUpIcon className="w-[18px] h-4" />,
    },
  ];

  // Cash accounts data
  const cashAccounts = [
    {
      name: "Emergency Fund",
      type: "Savings",
      balance: "$10,000.00",
      icon: <WalletIcon className="w-4 h-4" />,
    },
    {
      name: "Vacation Fund",
      type: "Goals",
      balance: "$5,000.00",
      icon: <TargetIcon className="w-[18px] h-4" />,
    },
  ];

  // Credit cards data
  const creditCards = [
    {
      name: "Chase Sapphire",
      number: "**** 9012",
      balance: "-$2,150.00",
      icon: <CreditCardIcon className="w-[18px] h-4" />,
    },
    {
      name: "Amex Gold",
      number: "**** 3456",
      balance: "-$1,600.00",
      icon: <CreditCardIcon className="w-[18px] h-4" />,
    },
  ];

  return (
    <div className="w-full max-w-[1187px] mx-auto py-8">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Accounts Management`} tag={`Manage your accounts efficiently`} />

      {/* Page title and action buttons */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Button className=" hover:bg-[#00a9e0]/90 text-white flex items-center gap-2 h-[42px]">
            <PlusCircleIcon className="w-3.5 h-4" />
            Add Accounts
          </Button>

          <Button
            variant="outline"
            className="border-[#004a7c] text-[#004a7c] flex items-center gap-2 h-[42px]"
          >
            <Image alt="Frame" src="/export_import_icon.svg" width={16} height={16} />
            Import/Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-xl border-l-4 border-l-[#004a7c] shadow-sm">
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-['Poppins',Helvetica] leading-[18px]">
                Total Balance
              </h3>
              <ChevronRightIcon className="w-2.5 h-4" />
            </div>
            <div className="text-2xl font-normal mb-4">$124,500.00</div>
            <div className="text-sm text-emerald-500">
              +2.4% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-l-4 border-l-[#00a9e0] shadow-sm">
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-['Poppins',Helvetica] leading-[18px]">
                Bank Accounts
              </h3>
              <LandmarkIcon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-normal mb-4">$45,250.00</div>
            <div className="text-sm text-gray-500">4 Active Accounts</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-l-4 border-l-[#004a7c] shadow-sm">
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-['Poppins',Helvetica] leading-[18px]">
                Credit Cards
              </h3>
              <CreditCardIcon className="w-[18px] h-4" />
            </div>
            <div className="text-2xl font-normal mb-4">$3,750.00</div>
            <div className="text-sm text-gray-500">2 Active Cards</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-l-4 border-l-[#00a9e0] shadow-sm">
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-['Poppins',Helvetica] leading-[18px]">
                Investments
              </h3>
              <TrendingUpIcon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-normal mb-4">$75,500.00</div>
            <div className="text-sm text-emerald-500">+5.2% return</div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Accounts Section */}
      <Card className="rounded-xl shadow-sm mb-6">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <CardTitle className="text-xl text-[#004a7c] font-['Poppins',Helvetica] leading-5">
            Bank Accounts
          </CardTitle>
          <Button
            className="text-[#00a9e0] bg-transparent hover:bg-transparent p-0 flex items-center gap-1 h-6"
          >
            <PlusCircleIcon className="w-3.5 h-4" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {bankAccounts.map((account, index) => (
            <div
              key={`bank-${index}`}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-4 last:mb-0"
            >
              <div className="flex items-center">
                {account.icon}
                <div className="ml-3">
                  <div className="text-base font-normal">{account.name}</div>
                  <div className="text-sm text-gray-500">{account.type}</div>
                </div>
              </div>
              <div className="text-base font-normal">{account.balance}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Investment Accounts Section */}
      <Card className="rounded-xl shadow-sm mb-6">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <CardTitle className="text-xl text-[#004a7c] font-['Poppins',Helvetica] leading-5">
            Investment Accounts
          </CardTitle>
          <Button
            className="text-[#00a9e0] bg-transparent hover:bg-transparent p-0 flex items-center gap-1 h-6"
          >
            <PlusCircleIcon className="w-3.5 h-4" />
            Add Investment
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {investmentAccounts.map((account, index) => (
            <div
              key={`investment-${index}`}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-4 last:mb-0"
            >
              <div className="flex items-center">
                {account.icon}
                <div className="ml-3">
                  <div className="text-base font-normal">{account.name}</div>
                  <div className="text-sm text-gray-500">{account.type}</div>
                </div>
              </div>
              <div className="text-base font-normal">{account.balance}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cash Accounts Section */}
      <Card className="rounded-xl shadow-sm mb-6">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <CardTitle className="text-xl text-[#004a7c] font-['Poppins',Helvetica] leading-5">
            Cash Accounts
          </CardTitle>
          <Button
            className="text-[#00a9e0] bg-transparent hover:bg-transparent p-0 flex items-center gap-1 h-6"
          >
            <PlusCircleIcon className="w-3.5 h-4" />
            Add Cash Account
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {cashAccounts.map((account, index) => (
            <div
              key={`cash-${index}`}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-4 last:mb-0"
            >
              <div className="flex items-center">
                {account.icon}
                <div className="ml-3">
                  <div className="text-base font-normal">{account.name}</div>
                  <div className="text-sm text-gray-500">{account.type}</div>
                </div>
              </div>
              <div className="text-base font-normal">{account.balance}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Credit Cards Section */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <CardTitle className="text-xl text-[#004a7c] font-['Poppins',Helvetica] leading-5">
            Credit Cards
          </CardTitle>
          <Button
            className="text-[#00a9e0] bg-transparent hover:bg-transparent p-0 flex items-center gap-1 h-6"
          >
            <PlusCircleIcon className="w-3.5 h-4" />
            Add Card
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {creditCards.map((card, index) => (
            <div
              key={`credit-${index}`}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-4 last:mb-0"
            >
              <div className="flex items-center">
                {card.icon}
                <div className="ml-3">
                  <div className="text-base font-normal">{card.name}</div>
                  <div className="text-sm text-gray-500">{card.number}</div>
                </div>
              </div>
              <div className="text-base font-normal text-red-500">
                {card.balance}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsBody;
