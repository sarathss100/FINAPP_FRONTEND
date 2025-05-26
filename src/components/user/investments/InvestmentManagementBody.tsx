"use client"
import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import UserHeader from '../base/Header';
import Image from 'next/image';
import { PlusCircleIcon } from 'lucide-react';
import InvestmentInputModal from './InvestmentInputModal';
// import { IInvestments } from '@/types/IInvestments';

const InvestmentManagementBody = function () {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  // const handleSaveInvestment = (investmentData: IInvestments) => {
  //   // Handle saving investment data
  //   console.log(investmentData);
  //   handleCloseModal();
  // };

  // Investment categories data
  const investmentCategories = [
    {
      id: 1,
      name: "Direct Stocks",
      icon: "/investment_icon.svg",
      amount: "₹ 8,45,000",
      details: "15 Stocks",
      returns: "+18.5%",
    },
    {
      id: 2,
      name: "Mutual Funds",
      icon: "/mutualfund_icon.svg",
      amount: "₹ 5,20,000",
      details: "8 Funds",
      returns: "+12.3%",
    },
    {
      id: 3,
      name: "Business",
      icon: "/business_icon.svg",
      amount: "₹ 3,50,000",
      details: "2 Ventures",
      returns: "+25.4%",
    },
    {
      id: 4,
      name: "Fixed Deposits",
      icon: "/fixeddeposit_icon.svg",
      amount: "₹ 2,15,000",
      details: "3 FDs",
      returns: "6.5% p.a",
    },
    {
      id: 5,
      name: "EPFO",
      icon: "/piggy_darkblue_icon.svg",
      amount: "₹ 2,80,000",
      details: "Monthly",
      returns: "+8.1%",
    },
    {
      id: 6,
      name: "Gold",
      icon: "/gold_icon.svg",
      amount: "₹ 1,85,000",
      details: "250 grams",
      returns: "+15.2%",
    },
    {
      id: 7,
      name: "Property",
      icon: "/property_icon.svg",
      amount: "₹ 95,00,000",
      details: "2 Properties",
      returns: "+45.8% (5 years)",
    },
  ];

  // Parked fund data
  const parkedFunds = [
    {
      id: 1,
      name: "Govt bonds",
      icon: "/wallet_darkblue_icon.svg",
      amount: "₹ 10,000.00",
      type: "Savings",
    },
    {
      id: 2,
      name: "Liquid",
      icon: "/piggy_darkblue_icon.svg",
      amount: "₹ 5,000.00",
      type: "Goals",
    },
  ];

  return (
    <div className="p-8 max-w-[1187px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />
            
        <div className="flex justify-between items-center">
          <div></div>
          <div className="flex gap-4">
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200 flex items-center gap-2 h-[42px] px-5 rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={handleOpenModal}
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Investment
            </Button>
          </div>
        </div>


      {/* Summary Cards */}
      <section className="grid grid-cols-2 gap-6 mb-8 mt-8">
        <Card className="bg-[#004a7c] text-white border-none rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-['Poppins',Helvetica] font-normal text-lg mb-4">
              Total Investment Value
            </h2>
            <p className="font-['Poppins',Helvetica] font-normal text-3xl mb-4">
              ₹ 24,56,789
            </p>
            <div className="flex items-center">
              <Image src="/growth_blue_icon.svg" alt="Trend" className="mr-2" width={16} height={16} />
              <span className="font-['Poppins',Helvetica] font-normal text-base text-[#00a9e0]">
                +12.5% this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00a9e0] text-white border-none rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-['Poppins',Helvetica] font-normal text-lg mb-4">
              Total Returns
            </h2>
            <p className="font-['Poppins',Helvetica] font-normal text-3xl mb-4">
              ₹ 3,45,678
            </p>
            <div className="flex items-center">
              <Image src="/growthchart_white_icon.svg" alt="Trend" className="mr-2" width={16} height={16} />
              <span className="font-['Poppins',Helvetica] font-normal text-base">
                +8.2% overall returns
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Investment Categories */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        {investmentCategories.slice(0, 6).map((category) => (
          <Card
            key={category.id}
            className="rounded-xl shadow-[0px_1px_2px_#0000000d]"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    className="mr-2"
                    width={20}
                    height={20}
                  />
                  <h3 className="font-['Poppins',Helvetica] font-normal text-lg text-black">
                    {category.name}
                  </h3>
                </div>
                <span className="font-['Poppins',Helvetica] font-normal text-base text-[#00a9e0]">
                  {category.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['Poppins',Helvetica] font-normal text-sm text-gray-600">
                  {category.details}
                </span>
                <span className="font-['Poppins',Helvetica] font-normal text-sm text-gray-600">
                  {category.returns}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Property Card (Full Width) */}
      <section className="mb-8">
        <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image
                  src={investmentCategories[6].icon}
                  alt={investmentCategories[6].name}
                  className="mr-2"
                  height={20}
                  width={20}
                />
                <h3 className="font-['Poppins',Helvetica] font-normal text-lg text-black">
                  {investmentCategories[6].name}
                </h3>
              </div>
              <span className="font-['Poppins',Helvetica] font-normal text-base text-[#00a9e0]">
                {investmentCategories[6].amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Poppins',Helvetica] font-normal text-sm text-gray-600">
                {investmentCategories[6].details}
              </span>
              <span className="font-['Poppins',Helvetica] font-normal text-sm text-gray-600">
                {investmentCategories[6].returns}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Parked Fund Section */}
      <section>
        <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d]">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
            <CardTitle className="font-['Poppins',Helvetica] font-normal text-xl text-[#004a7c]">
              Parked Fund
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            {parkedFunds.map((fund) => (
              <div
                key={fund.id}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <Image
                    src={fund.icon}
                    alt={fund.name}
                    className="mr-3"
                    height={16}
                    width={16}
                  />
                  <div>
                    <p className="font-['Poppins',Helvetica] font-normal text-base text-black">
                      {fund.name}
                    </p>
                    <p className="font-['Poppins',Helvetica] font-normal text-sm text-gray-500">
                      {fund.type}
                    </p>
                  </div>
                </div>
      
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Investment Input Modal */}
      <InvestmentInputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // onSaveInvestment={handleSaveInvestment}
      />
    </div>
  );
};

export default InvestmentManagementBody;
