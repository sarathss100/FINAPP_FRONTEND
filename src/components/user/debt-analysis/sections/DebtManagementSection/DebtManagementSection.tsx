"use client";
import { createDebt } from '@/service/debtService';
import useDebtStore from '@/stores/debt/debtStore';
import { PlusCircle, TrendingUp, Calendar, DollarSign, BarChart3, XIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';

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
    barColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    barWidths: [95, 75, 60, 45, 30],
    results: {
      time: "32 months",
      interest: "Interest Saved: $4,280",
      payment: "$1,250",
    },
    recommended: true,
  },
  {
    title: "Snowball Effect Approach",
    description:
      "Start with the smallest debt first while making minimum payments on larger ones. Use the momentum to tackle bigger debts.",
    barColor: "bg-gradient-to-r from-slate-600 to-slate-700",
    barWidths: [30, 45, 60, 75, 95],
    results: {
      time: "36 months",
      interest: "Interest Paid: $5,120",
      payment: "$1,250",
    },
    recommended: false,
  },
];

// Common debt types for dropdown
const debtTypes = [
  'Mortgage Loan',
  'Education Loan',
  'Business Loan',
  'Student Loan',
  'Investment Loan',
  'Rental Property Loan',
  'Vehicle Loan (commercial use)',
  'Low-interest loan for appreciating assets',

  'Credit Card Debt',
  'Personal Loan (for consumption)',
  'Payday Loan',
  'Entertainment Loan',
  'Medical Debt (non-essential)',
  'High-interest financing (appliances, furniture)',
  'Luxury Item Financing',
  'Gambling Debt',
  'Vehicle Loan (personal use)',
  'Home Maintenance Loan',
  'Medical Debt (emergency treatment)',
  'Lend From Others'
];

// Interest types
const interestTypes = [
  'Flat',
  'Diminishing',
];

// const ProgressBar = ({ value, max, className }: { value: number; max: number; className?: string }) => {
//   const percentage = (value / max) * 100;
//   return (
//     <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
//       <div 
//         className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   );
// };

const Card = ({ children, className = "", hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={`bg-white rounded-xl border border-gray-100 ${hover ? 'hover:shadow-xl hover:-translate-y-1' : 'shadow-lg'} transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 pb-2 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 pt-2 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-xl font-bold text-slate-800 ${className}`}>
    {children}
  </h3>
);

const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
    {children}
  </span>
);

const Button = ({ children, className = "", onClick, type = "button", disabled = false }: { 
  children: React.ReactNode, 
  className?: string, 
  hover?: boolean, 
  onClick?: () => void,
  type?: "button" | "submit",
  disabled?: boolean
}) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200">
    <table className={`w-full ${className}`}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <thead className={`bg-gradient-to-r from-gray-50 to-gray-100 ${className}`}>
    {children}
  </thead>
);

const TableBody = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <tbody className={`divide-y divide-gray-200 ${className}`}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <tr className={`hover:bg-gray-50 transition-colors duration-150 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
);

const DebtManagementSection = function () {
  const totalDebt = useDebtStore((state) => state.totalDebt);
  const totalOutstandingDebtAmount = useDebtStore((state) => state.totalOutstandingDebtAmount);
  const totalMonthlyPayment = useDebtStore((state) => state.totalMonthlyPayment);
  const longestDebtTenure = useDebtStore((state) => state.longestDebtTenure);
  const fetchTotalDebt = useDebtStore((state) => state.fetchTotalDebt);
  const fetchTotalOutstandingDebtAmount = useDebtStore((state) => state.fetchTotalOutstandingDebtAmount);
  const fetchTotalMonthlyPayment = useDebtStore((state) => state.fetchTotalMonthlyPayment);
  const fetchLongestDebtTenure = useDebtStore((state) => state.fetchLongestDebtTenure);

  const handleStore = useCallback(function () {
    fetchTotalDebt()
    fetchTotalOutstandingDebtAmount();
    fetchTotalMonthlyPayment();
    fetchLongestDebtTenure();
  }, [fetchTotalOutstandingDebtAmount, fetchTotalMonthlyPayment, fetchTotalDebt, fetchLongestDebtTenure]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    debtName: '',
    initialAmount: '',
    currency: 'INR',
    interestRate: '',
    interestType: '',
    tenureMonths: '',
    startDate: '',
    notes: '',
    additionalCharges: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.debtName || !formData.initialAmount || !formData.interestRate || !formData.startDate) {
        toast.info('Please fill in all required fields');
        return;
      }

      const initialAmount = Number(formData.initialAmount);
      const interestRate = Number(formData.interestRate);
      const tenureMonths = Number(formData.tenureMonths);
      const additionalCharges = Number(formData.additionalCharges) || 0;
      const startDate = new Date(formData.startDate);

      const refinedData = {
        ...formData,
        initialAmount,
        interestRate,
        tenureMonths,
        additionalCharges,
        startDate,
      };

      // Here you would call your API to add the debt
      const response = await createDebt(refinedData);
      if (response.success) {
        toast.success(response.message || 'Debt added successfully!');
      }
      // Reset form and close modal
      setFormData({
        debtName: '',
        initialAmount: '',
        currency: 'INR',
        interestRate: '',
        interestType: '',
        tenureMonths: '',
        startDate: '',
        notes: '',
        additionalCharges: ''
      });

      setShowAddDebtModal(false);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to create the debt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddDebtModal(false);
    setFormData({
      debtName: '',
      initialAmount: '',
      currency: 'INR',
      interestRate: '',
      interestType: '',
      tenureMonths: '',
      startDate: '',
      notes: '',
      additionalCharges: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <Button 
              onClick={() => setShowAddDebtModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl px-6 py-3 gap-2 transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Add Debt
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600">Total Debt Amount</p>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                ₹ {totalDebt}
                </h3>
              </CardContent>
            </Card>

            <Card className="group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Payment Rate</p>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                ₹ {totalMonthlyPayment.toFixed(2)}
                </h3>
              </CardContent>
            </Card>

            <Card className="group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600">Left to Pay</p>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                ₹ {totalOutstandingDebtAmount}
                </h3>
              </CardContent>
            </Card>

            <Card className="group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600">Time to Debt-Free</p>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    {longestDebtTenure} months left
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">At current payment rate</p>
                </CardContent>
              </Card>
          </div>

          {/* Debt Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Good Debt */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-emerald-700">Good Debt</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goodDebts.map((debt, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-base font-semibold text-slate-800">
                            {debt.name}
                          </p>
                          <p className="text-sm text-emerald-700 font-medium">
                            {debt.interest}
                          </p>
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {debt.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bad Debt */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                  </div>
                  <CardTitle className="text-red-700">Bad Debt</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badDebts.map((debt, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-base font-semibold text-slate-800">
                            {debt.name}
                          </p>
                          <p className="text-sm text-red-700 font-medium">
                            {debt.interest}
                          </p>
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {debt.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Debt List Table */}
          <Card className="mb-10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle>Debt List by Interest Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debt Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Monthly Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debtList.map((debt, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold text-slate-800">
                        {debt.type}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800">
                        {debt.amount}
                      </TableCell>
                      <TableCell className={`font-bold ${debt.interestColor}`}>
                        {debt.interestRate}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800">
                        {debt.monthlyPayment}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${debt.statusColor} font-semibold`}>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {approachResults.map((approach, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{approach.title}</CardTitle>
  
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Visualization */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border">
                    <div className="flex flex-col space-y-3">
                      {approach.barWidths.map((width, i) => (
                        <div
                          key={i}
                          className={`h-4 rounded-full ${approach.barColor} shadow-sm transition-all duration-700 ease-out hover:scale-105`}
                          style={{ 
                            width: `${width}%`,
                            animation: `slideIn 0.8s ease-out ${i * 0.1}s both`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {approach.description}
                  </p>

                  {/* Results */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border">
                    <p className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Projected Results:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          Total Time: <span className="font-bold">{approach.results.time}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          {approach.results.interest}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          Monthly Payment: <span className="font-bold">{approach.results.payment}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add Debt Modal */}
      {showAddDebtModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-slate-800">
                Add New Debt
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDebt} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Debt Name */}
                <div>
                  <label htmlFor="debtName" className="block text-sm font-medium text-gray-700 mb-2">
                    Debt Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="debtName"
                    name="debtName"
                    value={formData.debtName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Debt Type</option>
                    {debtTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Initial Amount */}
                <div>
                  <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="initialAmount"
                    name="initialAmount"
                    value={formData.initialAmount}
                    onChange={handleInputChange}
                    placeholder="Enter initial amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Currency */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                {/* Interest Rate */}
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="Enter interest rate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Interest Type */}
                <div>
                  <label htmlFor="interestType" className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Type
                  </label>
                  <select
                    id="interestType"
                    name="interestType"
                    value={formData.interestType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Select Interest Type</option>
                    {interestTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tenure Months */}
                <div>
                  <label htmlFor="tenureMonths" className="block text-sm font-medium text-gray-700 mb-2">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    id="tenureMonths"
                    name="tenureMonths"
                    value={formData.tenureMonths}
                    onChange={handleInputChange}
                    placeholder="Enter tenure in months"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Additional Charges */}
                <div>
                  <label htmlFor="additionalCharges" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Charges
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="additionalCharges"
                    name="additionalCharges"
                    value={formData.additionalCharges}
                    onChange={handleInputChange}
                    placeholder="Enter additional charges"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter any additional notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Debt...
                    </div>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Add Debt
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DebtManagementSection;
