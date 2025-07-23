"use client";
import {
  ChevronRightIcon,
  CreditCardIcon,
  LandmarkIcon,
  PlusCircleIcon,
  TrendingUpIcon,
  WalletIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import PageTitle from '../base/PageTitle';
import UserHeader from '../base/Header';
import { AccountModal } from './AccountInputModal';
import { IAccount } from '@/types/IAccounts';
import { removeAccount } from '@/service/accountService';
import { toast } from 'react-toastify';
import { useAccountsStore } from "@/stores/accounts/accountsStore";

const AccountsBody = function () {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<IAccount | undefined>(undefined);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const totalBalance = useAccountsStore((state) => state.totalBalance);
  const totalBankBalance = useAccountsStore((state) => state.totalBankBalance);
  const totalDebt = useAccountsStore((state) => state.totalDebt);
  const totalInvestment = useAccountsStore((state) => state.totalInvestment);
  const bankAccounts = useAccountsStore((state) => state.bankAccounts);
  const investmentAccounts = useAccountsStore((state) => state.investmentAccounts);
  const liquidAccounts = useAccountsStore((state) => state.liquidAccounts);
  const debtAccounts = useAccountsStore((state) => state.debtAccounts);
  const isConnected = useAccountsStore((state) => state.isConnected);
  const connectionError = useAccountsStore((state) => state.connectionError);
  const fetchAllDataWithHttpFallback = useAccountsStore((state) => state.fetchAllDataWithHttpFallback);

  // Fallback to HTTP if socket connection fails
  useEffect(() => {
    if (connectionError) {
      console.warn('Socket connection failed, falling back to HTTP:', connectionError);
      fetchAllDataWithHttpFallback();
    }
  }, [connectionError, fetchAllDataWithHttpFallback]);

  const handleAddAccount = function () {
    setAccountToEdit(undefined);
    setIsInputModalOpen(true);
  }

  const handleEditAccount = function (account: IAccount) {
    setAccountToEdit(account);
    setIsInputModalOpen(true);
  }

  const handleDeleteAccount = async function (accountId: string) {
    try {
      const response = await removeAccount(accountId);
      if (response.success) {
        toast.success(response.message || `Account Successfully Removed`);
        // await handleStore();
        setDeleteConfirmationId(null);
        if (!isConnected) {
          await fetchAllDataWithHttpFallback();
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {}
  }

  const handleSaveAccount = async function () {
    if (!isConnected) {
      await fetchAllDataWithHttpFallback();
    }
  }

  const handleModalClose = useCallback(async () => {
    setIsInputModalOpen(false);

    if (!isConnected) {
      await fetchAllDataWithHttpFallback();
    }
  }, [isConnected, fetchAllDataWithHttpFallback]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const renderAccountItem = (account: IAccount, icon: React.ReactNode, isDebt: boolean = false) => (
    <div
      key={account._id}
      className="flex justify-between items-center bg-white hover:bg-gray-50 rounded-xl p-5 mb-4 last:mb-0 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md group relative"
    >
      <div className="flex items-center">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-[#004a7c]">
          {icon}
        </div>
        <div className="ml-4">
          <div className="text-lg font-medium text-gray-800">{account.account_name}</div>
          <div className="text-base text-gray-600">{account.institution}</div>
          <div className="text-sm text-gray-500 mt-1">{account.account_type}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className={`text-lg font-semibold ${isDebt ? 'text-[#004a7c]' : 'text-[#004a7c]'}`}>
          {formatCurrency(account.current_balance || 0)}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditAccount(account)}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#004a7c] transition-colors duration-200 opacity-0 group-hover:opacity-100"
            title="Edit Account"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => account._id ? setDeleteConfirmationId(account._id) : null}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#004a7c] transition-colors duration-200 opacity-0 group-hover:opacity-100"
            title="Delete Account"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Delete confirmation overlay */}
      {deleteConfirmationId === account._id && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl flex items-center justify-center p-4 z-10 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this account?</p>
            <div className="flex justify-center gap-3">
              <Button 
                onClick={() => account._id && handleDeleteAccount(account._id)}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2"
              >
                Delete
              </Button>
              <Button 
                onClick={() => setDeleteConfirmationId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-[1187px] mx-auto py-8 px-4 sm:px-6 lg:px-0">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title with animation */}
      <div className="mb-8">
        <PageTitle title={`Accounts Management`} tag={`Manage your accounts efficiently`} />
      </div>

      {/* Page action buttons */}
      <div className="flex justify-end items-center mb-8">
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200 flex items-center gap-2 h-[42px] px-5 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={handleAddAccount}
        >
          <PlusCircleIcon className="w-4 h-4" />
          Add Accounts
        </Button>
      </div>

      {/* Summary Cards with hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="rounded-xl overflow-hidden relative bg-gradient-to-br from-blue-50 to-white border-none shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004a7c]"></div>
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-medium">
                Grand Total Balance
              </h3>
              <ChevronRightIcon className="w-5 h-5 text-[#004a7c]" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(totalBalance)}
            </div>
            <div className="text-sm text-[#004a7c] flex items-center">
              <ArrowUpIcon className="w-3.5 h-3.5 mr-1" />
              Net Asset Value
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden relative bg-gradient-to-br from-blue-50 to-white border-none shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004a7c]"></div>
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-medium">
                Total Bank Balance
              </h3>
              <LandmarkIcon className="w-5 h-5 text-[#004a7c]" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(totalBankBalance)}
            </div>
            <div className="text-sm text-[#004a7c] flex items-center">
              <ArrowUpIcon className="w-3.5 h-3.5 mr-1" />
              Liquid Assets
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden relative bg-gradient-to-br from-blue-50 to-white border-none shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004a7c]"></div>
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-medium">
                Total Debt
              </h3>
              <CreditCardIcon className="w-5 h-5 text-[#004a7c]" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(totalDebt)}
            </div>
            <div className="text-sm text-[#004a7c] flex items-center">
              <ArrowDownIcon className="w-3.5 h-3.5 mr-1" />
              Liabilities
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden relative bg-gradient-to-br from-blue-50 to-white border-none shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004a7c]"></div>
          <CardContent className="p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#004a7c] font-medium">
                Total Investments
              </h3>
              <TrendingUpIcon className="w-5 h-5 text-[#004a7c]" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(totalInvestment)}
            </div>
            <div className="text-sm text-[#004a7c] flex items-center">
              <ArrowUpIcon className="w-3.5 h-3.5 mr-1" />
              Growth Assets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Accounts Section */}
      {bankAccounts.length > 0 && 
        <Card className="rounded-xl shadow-lg border-none mb-8 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white">
            <CardTitle className="text-xl text-white font-medium flex items-center gap-2">
              <LandmarkIcon className="w-5 h-5" />
              Bank Accounts
            </CardTitle>
            <div className="rounded-full bg-[#004a7c] bg-opacity-30 px-3 py-1 text-white text-sm">
              {bankAccounts.length} accounts
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-white">
            {bankAccounts.map((account) => 
              renderAccountItem(account, <LandmarkIcon className="w-5 h-5" />)
            )}
          </CardContent>
        </Card>
      }

      {/* Investment Accounts Section */}
      {investmentAccounts.length > 0 && 
        <Card className="rounded-xl shadow-lg border-none mb-8 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white">
            <CardTitle className="text-xl text-white font-medium flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              Investment Accounts
            </CardTitle>
            <div className="rounded-full bg-[#004a7c] bg-opacity-30 px-3 py-1 text-white text-sm">
              {investmentAccounts.length} accounts
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-white">
            {investmentAccounts.map((account) => 
              renderAccountItem(account, <TrendingUpIcon className="w-5 h-5" />)
            )}
          </CardContent>
        </Card>
      }

      {/* Cash Accounts Section */}
      {liquidAccounts.length > 0 &&
        <Card className="rounded-xl shadow-lg border-none mb-8 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white">
            <CardTitle className="text-xl text-white font-medium flex items-center gap-2">
              <WalletIcon className="w-5 h-5" />
              Liquid Cash
            </CardTitle>
            <div className="rounded-full bg-[#004a7c] bg-opacity-30 px-3 py-1 text-white text-sm">
              {liquidAccounts.length} accounts
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-white">
            {liquidAccounts.map((account) => 
              renderAccountItem(account, <WalletIcon className="w-5 h-5" />)
            )}
          </CardContent>
        </Card>
      }

      {/* Credit Cards Section */}
      {debtAccounts.length > 0 &&
        <Card className="rounded-xl shadow-lg border-none mb-8 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white">
            <CardTitle className="text-xl text-white font-medium flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              Debt Accounts
            </CardTitle>
            <div className="rounded-full bg-[#004a7c] bg-opacity-30 px-3 py-1 text-white text-sm">
              {debtAccounts.length} accounts
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-white">
            {debtAccounts.map((account) => 
              renderAccountItem(account, <CreditCardIcon className="w-5 h-5" />, true)
            )}
          </CardContent>
        </Card>
      }

      {/* Empty state if no accounts */}
      {bankAccounts.length === 0 && investmentAccounts.length === 0 && 
       liquidAccounts.length === 0 && debtAccounts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 p-4 rounded-full bg-blue-50">
            <WalletIcon className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No accounts yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first account</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 flex items-center gap-2 h-[42px] px-5 rounded-full"
            onClick={handleAddAccount}
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add First Account
          </Button>
        </div>
      )}

      {/* Render the account modal */}
      <AccountModal
        isOpen={isInputModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveAccount}
        accountToEdit={accountToEdit}
      />
    </div>
  );
};

export default AccountsBody;
