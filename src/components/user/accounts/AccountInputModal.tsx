"use client";
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/base/Dialog';
import { 
  Wallet, 
  Building, 
  CreditCard, 
  TrendingUp,
  Save, 
  X,
  IndianRupee
} from "lucide-react";
import Button from "@/components/base/Button";
import { toast } from 'react-toastify';
import { IAccount } from '@/types/IAccounts';
import { addAccount, updateAccount } from '@/service/accountService';

const ACCOUNT_TYPES = [
  { value: 'Bank', icon: <Building className="w-5 h-5" />, label: 'Bank Account' },
  { value: 'Debt', icon: <CreditCard className="w-5 h-5" />, label: 'Debt Account' },
  { value: 'Investment', icon: <TrendingUp className="w-5 h-5" />, label: 'Investment Account' },
  { value: 'Cash', icon: <Wallet className="w-5 h-5" />, label: 'Cash Account' }
];

// Define account subtypes
const BANK_SUBTYPES = [
  { value: 'Savings', label: 'Savings Account' },
  { value: 'Current', label: 'Current Account' },
  { value: 'FD', label: 'Fixed Deposit' },
  { value: 'RD', label: 'Recurring Deposit' }
];

const DEBT_TYPES = [
  { value: 'Mortgage', label: 'Mortgage Loan' },
  { value: 'Student', label: 'Student Loan' },
  { value: 'Personal', label: 'Personal Loan' },
  { value: 'Auto', label: 'Auto Loan' },
  { value: 'Credit Card', label: 'Credit Card' }
];

const CASH_LOCATIONS = [
  { value: 'Home', label: 'Home' },
  { value: 'Safe', label: 'Safe' },
  { value: 'Wallet', label: 'Wallet' },
  { value: 'Office', label: 'Office' }
];

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: IAccount) => void;
  accountToEdit?: IAccount;
}

export const AccountModal = ({
  isOpen,
  onClose,
  onSave,
  accountToEdit
}: AccountModalProps) => {
  // Default form values
  const defaultFormValues = React.useMemo(() => ({
    account_name: '',
    account_type: 'Bank' as 'Bank' | 'Debt' | 'Investment' | 'Cash',
    currency: 'INR',
    description: '',
    current_balance: 0,
    institution: '',
    account_number: '',
    account_subtype: 'Savings',
    loan_type: 'Personal' as "Mortgage" | "Student" | "Personal" | "Auto" | "Credit Card",
    interest_rate: 0,
    monthly_payment: 0,
    due_date: new Date().toISOString().split('T')[0],
    term_months: 12,
    investment_platform: '',
    portfolio_value: 0,
    location: 'Wallet',
    is_active: true
  }), []);

  // State hooks
  const [formData, setFormData] = useState(defaultFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing an account
  useEffect(() => {
    if (accountToEdit) {
      setFormData({
        ...defaultFormValues,
        ...accountToEdit,
        due_date: accountToEdit.due_date 
          ? new Date(accountToEdit.due_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData(defaultFormValues);
    }
  }, [accountToEdit, isOpen, defaultFormValues]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle account type change
  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value as 'Bank' | 'Debt' | 'Investment' | 'Cash';
      setFormData(prev => ({
        ...prev,
        account_type: newType,
        // Reset type-specific fields when changing account type
        account_subtype: newType === 'Bank' ? 'Savings' : '',
        loan_type: newType === 'Debt' ? 'Personal' : 'Personal', // Always set a valid value
        interest_rate: newType === 'Debt' ? 0 : 0,
        monthly_payment: newType === 'Debt' ? 0 : 0,
        due_date: newType === 'Debt' ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        term_months: newType === 'Debt' ? 12 : 0,
        investment_platform: newType === 'Investment' ? '' : '',
        portfolio_value: newType === 'Investment' ? 0 : 0,
        location: newType === 'Cash' ? 'Wallet' : '',
      }));
    };

  // Validate form data based on account type
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Common validation
    if (!formData.account_name || formData.account_name.length < 2) {
      newErrors.account_name = 'Account name must be at least 2 characters';
    }

    // Type-specific validation
    if (formData.account_type === 'Bank' || formData.account_type === 'Investment' || formData.account_type === 'Cash') {
      if (formData.current_balance < 0) {
        newErrors.current_balance = 'Balance cannot be negative';
      }
    }

    if (formData.account_type === 'Debt') {
      if (formData.interest_rate! < 0 || formData.interest_rate! > 100) {
        newErrors.interest_rate = 'Interest rate must be between 0 and 100';
      }
      
      if (formData.monthly_payment! < 0) {
        newErrors.monthly_payment = 'Monthly payment cannot be negative';
      }
      
      if (formData.term_months! <= 0) {
        newErrors.term_months = 'Term months must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Create a clean object with only the fields relevant to the account type
        const cleanData = {
          ...formData,
          // For Debt accounts, convert due_date string to Date object
          due_date: formData.due_date 
            ? new Date(formData.due_date).toISOString() 
            : undefined,
          created_by: accountToEdit?.created_by || '',
          // Ensure account_subtype is properly typed
          account_subtype: formData.account_type === 'Bank' 
            ? (formData.account_subtype as "Savings" | "Current" | "FD" | "RD") 
            : undefined,
          // Ensure loan_type is properly typed
          loan_type: formData.account_type === 'Debt'
            ? (formData.loan_type as "Mortgage" | "Student" | "Personal" | "Auto" | "Credit Card")
            : undefined
        };
        
        // First call onSave to update parent component state
        onSave(cleanData as IAccount);

        // Then submit to backend
        let response;
        if (accountToEdit?._id) {
          // If we're editing an existing account
          response = await updateAccount(accountToEdit._id, cleanData as IAccount);
        } else {
          // If we're creating a new account
          response = await addAccount(cleanData as IAccount);
        }
        
        if (response.success) {
          toast.success(`Account ${accountToEdit ? 'updated' : 'created'} successfully!`);
          onClose();
        }
        
      } catch (error) {
        console.error(`Error ${accountToEdit ? 'updating' : 'saving'} account:`, error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative pb-0">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
            <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
            {accountToEdit ? 'Edit Account' : 'Add New Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Account Type Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              name="account_type"
              value={formData.account_type}
              onChange={handleAccountTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {ACCOUNT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.account_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter account name"
                required
              />
              {errors.account_name && (
                <p className="mt-1 text-sm text-red-600">{errors.account_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              >
                <option value="INR">Indian Rupee (INR)</option>
              </select>
            </div>
          </div>
          
          {/* Current Balance */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.account_type === 'Debt' ? 'Current Debt Amount' : 'Current Balance'}*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                name="current_balance"
                value={formData.current_balance}
                onChange={handleChange}
                className={`w-full pl-7 px-3 py-2 border ${errors.current_balance ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="0.00"
                required
              />
            </div>
            {errors.current_balance && (
              <p className="mt-1 text-sm text-red-600">{errors.current_balance}</p>
            )}
          </div>
          
          {/* Institution Field (for Bank, Debt, Investment) */}
          {(formData.account_type === 'Bank' || formData.account_type === 'Debt' || formData.account_type === 'Investment') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter institution name"
              />
            </div>
          )}
          
          {/* Bank Account Specific Fields */}
          {formData.account_type === 'Bank' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Subtype
                  </label>
                  <select
                    name="account_subtype"
                    value={formData.account_subtype || 'Savings'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {BANK_SUBTYPES.map(subtype => (
                      <option key={subtype.value} value={subtype.value}>
                        {subtype.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account number"
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Debt Account Specific Fields */}
          {formData.account_type === 'Debt' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Type
                  </label>
                  <select
                    name="loan_type"
                    value={formData.loan_type || 'Personal'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {DEBT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate || 0}
                    onChange={handleChange}
                    step="0.01"
                    className={`w-full px-3 py-2 border ${errors.interest_rate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0.00"
                  />
                  {errors.interest_rate && (
                    <p className="mt-1 text-sm text-red-600">{errors.interest_rate}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Payment
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      name="monthly_payment"
                      value={formData.monthly_payment || 0}
                      onChange={handleChange}
                      className={`w-full pl-7 px-3 py-2 border ${errors.monthly_payment ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.monthly_payment && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthly_payment}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term (Months)
                </label>
                <input
                  type="number"
                  name="term_months"
                  value={formData.term_months || 12}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.term_months ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="12"
                />
                {errors.term_months && (
                  <p className="mt-1 text-sm text-red-600">{errors.term_months}</p>
                )}
              </div>
            </>
          )}
          
          {/* Investment Account Specific Fields */}
          {formData.account_type === 'Investment' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Platform
              </label>
              <input
                type="text"
                name="investment_platform"
                value={formData.investment_platform || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter platform name"
              />
            </div>
          )}
          
          {/* Cash Account Specific Fields */}
          {formData.account_type === 'Cash' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="location"
                value={formData.location || 'Wallet'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {CASH_LOCATIONS.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Description Field (common for all) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a description for this account"
            />
          </div>
          
          {/* Active Status */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Account is active
            </label>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-1" />
              {isSubmitting ? 'Saving...' : accountToEdit ? 'Update Account' : 'Save Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
