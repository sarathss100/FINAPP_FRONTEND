import React from "react";
import { Badge } from '@/components/base/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';

export const MainContentSection = ()=> {
  // Data for the goal list table
  const goals = [
    {
      name: "Credit Card A",
      amount: "$3,200",
      interestRate: "19.99%",
      interestRateColor: "text-red-500",
      monthlyPayment: "$300",
      status: "In Progress",
      statusColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Personal Loan",
      amount: "$1,580",
      interestRate: "12.5%",
      interestRateColor: "text-orange-500",
      monthlyPayment: "$200",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <Card className="w-full rounded-xl shadow-[0px_1px_2px_#0000000d] border-0">
      <CardHeader className="pb-0 pt-6 px-6">
        <CardTitle className="text-xl font-semibold text-[#004a7c] font-['Roboto',Helvetica]">
          Goal List
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-xs tracking-[0.60px] text-gray-500 font-['Roboto',Helvetica]">
                Goal
              </TableHead>
              <TableHead className="font-medium text-xs tracking-[0.60px] text-gray-500 font-['Roboto',Helvetica]">
                Amount
              </TableHead>
              <TableHead className="font-medium text-xs tracking-[0.60px] text-gray-500 font-['Roboto',Helvetica]">
                Interest Rate if Any
              </TableHead>
              <TableHead className="font-medium text-xs tracking-[0.60px] text-gray-500 font-['Roboto',Helvetica]">
                Monthly Payment
              </TableHead>
              <TableHead className="font-medium text-xs tracking-[0.60px] text-gray-500 font-['Roboto',Helvetica]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal, index) => (
              <TableRow
                key={index}
                className={index > 0 ? "border-t border-solid" : ""}
              >
                <TableCell className="py-4 font-normal text-base font-['Roboto',Helvetica]">
                  {goal.name}
                </TableCell>
                <TableCell className="py-4 font-normal text-base font-['Roboto',Helvetica]">
                  {goal.amount}
                </TableCell>
                <TableCell
                  className={`py-4 font-normal text-base font-['Roboto',Helvetica] ${goal.interestRateColor}`}
                >
                  {goal.interestRate}
                </TableCell>
                <TableCell className="py-4 font-normal text-base font-['Roboto',Helvetica]">
                  {goal.monthlyPayment}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    className={`rounded-full font-normal text-xs px-2 py-1 ${goal.statusColor}`}
                    variant="outline"
                  >
                    {goal.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
