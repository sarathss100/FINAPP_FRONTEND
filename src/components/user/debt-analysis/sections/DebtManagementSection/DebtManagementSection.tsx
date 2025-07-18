"use client";
import { createDebt, markAsPaid, removeDebt } from '@/service/debtService';
import useDebtStore from '@/stores/debt/debtStore';
import { PlusCircle, TrendingUp, Calendar, BarChart3, XIcon, IndianRupee, CheckCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from 'react-toastify';

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

const DebtManagementSection = function () {
  const allDebts = useDebtStore((state) => state.allDebts);
  const totalDebt = useDebtStore((state) => state.totalDebt);
  const totalOutstandingDebtAmount = useDebtStore((state) => state.totalOutstandingDebtAmount);
  const totalMonthlyPayment = useDebtStore((state) => state.totalMonthlyPayment);
  const longestDebtTenure = useDebtStore((state) => state.longestDebtTenure);
  const goodDebts = useDebtStore((state) => state.goodDebts);
  const badDebts = useDebtStore((state) => state.badDebts);
  const repaymentSimulationResult = useDebtStore((state) => state.repaymentSimulationResult);

  // Helper function to get interest rate color
  const getInterestRateColor = (rate: number) => {
    if (rate <= 8) return "text-green-600";
    if (rate <= 12) return "text-orange-500";
    return "text-red-500";
  };

  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case 'completed':
        return "bg-green-100 text-green-800 border border-green-200";
      case 'overdue':
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Helper function to format monthly payment
  const formatMonthlyPayment = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleMarkAsPaid = async (debtId: string) => {
    try {
      const response = await markAsPaid(debtId);
      if (response.success) {
        toast.success(response.message || 'Updated Successfully');
        setDeleteConfirmationId(null);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to Mark As Paid!');
    }
  };

  const handleDeleteDebt = async (debtId: string) => {
    try {
      const response = await removeDebt(debtId);
      if (response.success) {
        toast.success(response.message || 'Successfully Removed Debt');
        setDeleteConfirmationId(null);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to Delele the Debt!');
    }
  };

  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
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
                            {debt.debtName}
                          </p>
                          <p className="text-sm text-emerald-700 font-medium">
                            {debt.interestRate} % Interest
                          </p>
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          ₹ {debt.initialAmount}
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
                            {debt.debtName}
                          </p>
                          <p className="text-sm text-red-700 font-medium">
                            {debt.interestRate} % Interest
                          </p>
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          ₹ {debt.initialAmount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Debt List Table */}
          <div className="mb-10 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Debt List by Interest Rate
          </h2>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Debt Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Interest Rate
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Monthly Payment
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allDebts
                .sort((a, b) => b.interestRate - a.interestRate) // Sort by interest rate (highest first)
                .map((debt) => (
                <tr key={debt._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {debt.debtName}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {formatCurrency(debt.currentBalance || debt.initialAmount, debt.currency)}
                  </td>
                  <td className={`py-4 px-4 font-bold ${getInterestRateColor(debt.interestRate)}`}>
                    {debt.interestRate}%
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {formatMonthlyPayment(debt.monthlyPayment || 0, debt.currency)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(debt.status || '')}`}>
                      {debt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {/* Mark as Paid Button - Only show if debt is active */}
                      {debt.isExpired === true && (
                        <button
                          onClick={() => handleMarkAsPaid(debt._id || '')}
                          className="inline-flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 text-xs border border-green-300 rounded-md transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark as Paid
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmationId(debt._id || '')}
                        className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 text-xs border border-red-300 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {allDebts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No debts found. Add a debt to get started.
            </div>
          )}
        </div>
      </div>
    </div>

          {/* Debt Repayment Approaches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">High Interest Rate Approach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Visualization */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border">
                    <div className="flex flex-col space-y-3">
                      {[95, 75, 60, 45, 30].map((width, i) => (
                        <div
                          key={i}
                          className={`h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm transition-all duration-700 ease-out hover:scale-105`}
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
                    Focus on paying off debts with the highest interest rates first while making minimum payments on others. (Calculation based on if you keep up the same emi payment + 1000 extra
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
                        Total Time: <span className="font-bold">{repaymentSimulationResult.avalanche.totalMonths} months</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          Interest Paid: {repaymentSimulationResult.avalanche.totalMonthlyPayment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          Monthly Payment: <span className="font-bold">{repaymentSimulationResult.avalanche.totalMonthlyPayment}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Snowball Effect Approach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Visualization */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border">
                    <div className="flex flex-col space-y-3">
                      {[30, 45, 60, 75, 95].map((width, i) => (
                        <div
                          key={i}
                          className={`h-4 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 shadow-sm transition-all duration-700 ease-out hover:scale-105`}
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
                  Start with the smallest debt first while making minimum payments on larger ones. Use the momentum to tackle bigger debts. (Calculation based on if you keep up the same emi payment + 1000 extra)
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
                        Total Time: <span className="font-bold">{repaymentSimulationResult.snowball.totalMonths} months</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          Interest Paid: {repaymentSimulationResult.snowball.totalMonthlyPayment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-slate-800 font-medium">
                          Monthly Payment: <span className="font-bold">{repaymentSimulationResult.snowball.totalMonthlyPayment}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

      {/* Delete confirmation overlay */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-black mb-3">
                Delete Debt
              </h3>
              <p className="text-black leading-relaxed">
                Are you sure you want to delete this Debt? This action cannot be undone and all associated data will be permanently removed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => deleteConfirmationId && handleDeleteDebt(deleteConfirmationId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-red-300 focus:ring-offset-2 shadow-lg hover:shadow-xl order-1 sm:order-2"
              >
                Delete Debt
              </Button>
              <Button 
                onClick={() => setDeleteConfirmationId(null)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-green-300 focus:ring-offset-2 order-2 sm:order-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtManagementSection;
