"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/Dialog';
import { IndianRupee } from "lucide-react";
import Button from "@/components/base/Button";
import { toast } from 'react-toastify';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string | null;
  goalName: string | null;
//   currency: string;
  onSubmit: (amount: number) => Promise<void>;
}

export const ContributionModal = ({ 
  isOpen, 
  onClose, 
  goalId, 
  goalName,
  onSubmit 
}: ContributionModalProps) => {
  const [contributionAmount, setContributionAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleContributionAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setContributionAmount(value);
      setError("");
      
      // Validate the amount is greater than zero
      if (value !== "" && parseFloat(value) <= 0) {
        setError("Amount must be greater than zero");
      }
    }
  };

  const handleContributionSubmit = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(parseFloat(contributionAmount));
      toast.success("Contribution added successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setContributionAmount("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      resetForm();
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className=''>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Add Contribution
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 mb-2">
          {goalName && (
            <p className="text-md text-gray-700 font-medium mb-2">
              {goalName}
            </p>
          )}
          
          <p className="mb-4 text-gray-600 text-sm">
            Add a contribution to help achieve your financial goal faster.
          </p>

          <div className="relative mt-3 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IndianRupee className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg`}
                placeholder="0.00"
                value={contributionAmount}
                onChange={handleContributionAmountChange}
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
              
          {goalId && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This contribution will be added to your goal and will reduce the pending amount.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContributionSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!contributionAmount || parseFloat(contributionAmount) <= 0 || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Add Contribution"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
