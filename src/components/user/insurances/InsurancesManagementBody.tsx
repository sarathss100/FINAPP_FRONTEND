"use client";
import {
  PlusCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Image from 'next/image';
import { useInsuranceStore } from '@/stores/store';
import { toast } from 'react-toastify';
import { createInsurance, markPaymentAsPaid, removeInsurance } from '@/service/insuranceService';

// Insurance types for dropdown
const insuranceTypes = [
  'Health Insurance',
  'Term Insurance', 
  'Property Insurance',
  'Life Insurance',
  'Vehicle Insurance',
  'Home Insurance',
  'Investment Insurance',
  'Shop Insurance'
];

const getIconForInsuranceType = (type: string): string => {
  const iconMap: Record<string, string> = {
    'Health Insurance': '/heart_blue_icon.svg',
    'Term Insurance': '/time_blue_icon.svg',
    'Life Insurance': '/user_blue_icon.svg',
    'Vehicle Insurance': '/car_blue_icon.svg',
    'Home Insurance': '/home_blue_icon.svg',
    'Property Insurance': '/building_blue_icon.svg',
    'Investment Insurance': '/growth_chart_blue_icon.svg',
    'Shop Insurance': '/shop_blue_icon.svg',
  };

  return iconMap[type] || '/icons/tick.svg';
};

// Helper function to format date consistently
const formatDate = (date: string | Date): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Use consistent formatting that works on both server and client
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.log((error as Error).message);
    return '';
  }
};

const InsuranceManagementBody = function () {
  const totalInsuranceCoverage = useInsuranceStore((state) => state.totalInsuranceCoverage);
  const totalAnnualPremium = useInsuranceStore((state) => state.totalAnnualInsurancePremium);
  const insurances = useInsuranceStore((state) => state.allInsurances);
  const upcomingPaymentDate = useInsuranceStore((state) => state.insuranceWithClosestNextPaymentDate);
  const fetchTotalInsuranceCoverage = useInsuranceStore((state) => state.fetchTotalInsuranceCoverage);
  const fetchTotalAnnualPremium = useInsuranceStore((state) => state.fetchTotalAnnualInsurancePremium);
  const fetchAllInsurances = useInsuranceStore((state) => state.fetchAllInsurances);
  const fetchUpcomingPaymentDate = useInsuranceStore((state) => state.fetchInsuranceWithClosestNextPaymentDate);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    coverage: '',
    premium: '',
    next_payment_date: '',
    payment_status: ''
  });

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStore = useCallback(() => {
    fetchTotalInsuranceCoverage();
    fetchTotalAnnualPremium();
    fetchAllInsurances();
    fetchUpcomingPaymentDate();
  }, [fetchTotalInsuranceCoverage, fetchTotalAnnualPremium, fetchAllInsurances, fetchUpcomingPaymentDate]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  const handleDeleteCard = async function (insuranceId: string) {
    try {
      const response = await removeInsurance(insuranceId);
      if (response.success) {
        toast.success(response.message || `Successfully Removed the Insurance`);
        await handleStore();
        setDeleteConfirmationId(null);
      }
    } catch (error) {
      toast.error((error as Error).message || `Failed to Delete the Insurance`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkAsPaid = async function (insuranceId: string) {
    try {
      const response = await markPaymentAsPaid(insuranceId);
      if (response.success) {
        toast.success(response.message || `Payment status updated Successfully`);
        await handleStore();
      }
    } catch (error) {
      toast.error((error as Error).message || `Failed to update the payment status`);
    }
  }

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.coverage || !formData.premium || !formData.next_payment_date) {
        toast.error('Please fill in all required fields');
        return;
      }

      const coverageAmount = Number(formData.coverage);
      const premiumAmount = Number(formData.premium);
      const date = new Date(formData.next_payment_date);

      const refinedData = {
        ...formData,
        coverage: coverageAmount,
        premium: premiumAmount,
        next_payment_date: date,
      }

      // Here you would call your API to add the policy
      const response = await createInsurance(refinedData);
      if (response.success) {
        toast.success(response.message || 'Policy added successfully!');

        // Reset form and close modal
        setFormData({
          type: '',
          coverage: '',
          premium: '',
          next_payment_date: '',
          payment_status: ''
        });

        // Refresh data
        await handleStore();
        setShowAddPolicyModal(false);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddPolicyModal(false);
    setFormData({
      type: '',
      coverage: '',
      premium: '',
      next_payment_date: '',
      payment_status: ''
    });
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <main className="container mx-auto p-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8 max-w-7xl">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Insurance Management`} tag={`Manage All your insurance on one place`} />

      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#004a7c] text-white rounded-xl border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-normal mb-4">
              Total Insurance Coverage
            </h2>
            <p className="text-3xl font-normal mb-4">
              ₹ {new Intl.NumberFormat('en-IN').format(totalInsuranceCoverage)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#00a9e0] text-white rounded-xl border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-normal mb-4">
              Total Annual Premium
            </h2>
            <p className="text-3xl font-normal mb-4">₹ {new Intl.NumberFormat('en-IN').format(totalAnnualPremium)}</p>
          </CardContent>
        </Card>
      </section>

      {/* Insurance cards grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {insurances.map((card) => (
    <Card
      key={card._id}
      className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a] relative group hover:shadow-[0px_6px_12px_#0000002a,0px_4px_8px_#0000002a] transition-all duration-300"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Image
            src={getIconForInsuranceType(card.type)}
            alt={`${card.type} icon`}
            height={30}
            width={30}
          />
          <div className="flex items-center gap-2">
            {card.status === 'active' ? (
              <Badge className="bg-[#00a9e01a] text-[#00a9e0] font-normal font-['Montserrat',Helvetica] text-sm px-3 py-1 rounded-full">
                active
              </Badge>
            ) : (
              <Badge className="bg-[#00a9e01a] text-red-500 font-normal font-['Montserrat',Helvetica] text-sm px-3 py-1 rounded-full">
                expired
              </Badge>
            )}
            
            <button
              onClick={() => card._id ? setDeleteConfirmationId(card._id) : null}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
              title="Delete Policy"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-4">
          {card.type}
        </h3>

        <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica] mb-4">
          Coverage: {card.coverage}
        </p>

        <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica] mb-4">
          Premium: {card.premium}
        </p>

        {/* Payment Status Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
              Payment Status:
            </p>
            {card.payment_status === 'paid' ? (
              <Badge className="bg-green-100 text-green-700 font-normal font-['Montserrat',Helvetica] text-xs px-2 py-1 rounded-full">
                Paid
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 font-normal font-['Montserrat',Helvetica] text-xs px-2 py-1 rounded-full">
                Pending
              </Badge>
            )}
          </div>
          
          {/* Show Mark as Paid button if payment is pending and policy is expired */}
          {card.payment_status !== 'paid' && card.status === 'expired' && (
            <button
              onClick={() => handleMarkAsPaid(card._id || '')}
              className="w-full mt-2 bg-[#00a9e0] hover:bg-[#0088b3] text-white font-normal font-['Montserrat',Helvetica] text-sm px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Mark as Paid
            </button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 font-normal font-['Montserrat',Helvetica]">
            Next Payment Date:{" "}
            {formatDate(card.next_payment_date)}
          </p>
        </div>
      </CardContent>
    </Card>
  ))}
</section>

      {/* Quick actions */}
      <section className="mb-8">
        <Card className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Button
                  onClick={() => setShowAddPolicyModal(true)}
                  className="bg-[#00a9e01a] text-[#004a7c] h-12 flex items-center justify-center gap-2 hover:bg-[#00a9e033]"
                >
                  <PlusCircleIcon className="w-3.5 h-4" />
                  <span className="font-normal font-['Montserrat',Helvetica] text-base">
                    Add New Policy
                  </span>
                </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Insurance summary */}
      <section>
        <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d]">
          <CardContent className="p-6">
            <h2 className="text-xl font-normal text-[#004a7c] font-['Poppins',Helvetica] mb-6">
              Insurance Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#004a7c0d] rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Image
                    src="/document_blue_icon.svg"
                    alt="Total Policies"
                    className="mr-2"
                    width={16}
                    height={16}
                  />
                  <span className="text-base text-gray-600 font-normal font-['Poppins',Helvetica]">
                    Total Policies
                  </span>
                </div>
                <p className="text-2xl text-[#004a7c] font-normal font-['Poppins',Helvetica]">
                  {insurances.length || 0}
                </p>
              </div>

              <div className="bg-[#004a7c0d] rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Image
                    src="/cash_darkblue_icon.svg"
                    alt="Total Premium"
                    className="mr-2"
                    width={16}
                    height={16}
                  />
                  <span className="text-base text-gray-600 font-normal font-['Poppins',Helvetica]">
                    Total Premium
                  </span>
                </div>
                <p className="text-2xl text-[#004a7c] font-normal font-['Poppins',Helvetica]">
                  ₹ {totalAnnualPremium || 0}
                </p>
              </div>

              <div className="bg-[#004a7c0d] rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Image
                    src="/cash_darkblue_icon.svg"
                    alt="Upcoming Payment Date"
                    className="mr-2"
                    width={16}
                    height={16}
                  />
                  <span className="text-base text-gray-600 font-normal font-['Poppins',Helvetica]">
                    Upcoming Payment Date
                  </span>
                </div>
                <p className="text-2xl text-[#004a7c] font-normal font-['Poppins',Helvetica]">
                  {upcomingPaymentDate?.next_payment_date ? formatDate(upcomingPaymentDate.next_payment_date) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Add Policy Modal */}
      {showAddPolicyModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica]">
                Add New Policy
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddPolicy} className="p-6 space-y-4">
              {/* Insurance Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0] outline-none transition-colors"
                >
                  <option value="">Select Insurance Type</option>
                  {insuranceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coverage */}
              <div>
                <label htmlFor="coverage" className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="coverage"
                  name="coverage"
                  value={formData.coverage}
                  onChange={handleInputChange}
                  placeholder="Enter coverage amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0] outline-none transition-colors"
                  required
                />
              </div>

              {/* Premium */}
              <div>
                <label htmlFor="premium" className="block text-sm font-medium text-gray-700 mb-2">
                  Premium Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="premium"
                  name="premium"
                  value={formData.premium}
                  onChange={handleInputChange}
                  placeholder="Enter premium amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0] outline-none transition-colors"
                  required
                />
              </div>

              {/* Next Payment Date */}
              <div>
                <label htmlFor="next_payment_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Next Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="next_payment_date"
                  name="next_payment_date"
                  value={formData.next_payment_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0] outline-none transition-colors"
                  required
                />
              </div>

              {/* Payment Status */}
              <div>
                <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  id="payment_status"
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a9e0] focus:border-[#00a9e0] outline-none transition-colors"
                >
                  <option value="">Select Payment Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#00a9e0] hover:bg-[#0090c4] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Policy'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                Delete Policy
              </h3>
              <p className="text-black leading-relaxed">
                Are you sure you want to delete this policy? This action cannot be undone and all associated data will be permanently removed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => deleteConfirmationId && handleDeleteCard(deleteConfirmationId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-red-300 focus:ring-offset-2 shadow-lg hover:shadow-xl order-1 sm:order-2"
              >
                Delete Policy
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
    </main>
  );
};

export default InsuranceManagementBody;
