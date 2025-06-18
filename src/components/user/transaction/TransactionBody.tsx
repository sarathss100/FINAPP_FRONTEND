"use client";
import { Search, Calendar, ChevronRight, Tag, ChevronLeft, UploadIcon, PlusCircleIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/Tabs';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import AdvancedFinancialCalendar from './AdvancedFinancialCalendar';
import { TransactionInputModal } from './TransactionInputModal';
import { ITransaction } from '@/types/ITransaction';
import { addTransaction } from '@/service/transactionService';
import { useAccountsStore } from '@/stores/store';
import { updateAccount } from '@/service/accountService';
import ImportModal from './ImportModal';
import BankStatementUploader from './BankStatementUploader';
import useTransactionStore from '@/stores/transaction/transactionStore';

const TransactionBody = function () {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTransactionInputModalOpen, setIsTransactionInputModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const bankAccounts = useAccountsStore((state) => state.bankAccounts);
  const investmentAccounts = useAccountsStore((state) => state.investmentAccounts);
  const liquidAccounts = useAccountsStore((state) => state.liquidAccounts);
  const debtAccounts = useAccountsStore((state) => state.debtAccounts);
  const totalBalance = useAccountsStore((state) => state.totalBalance);
  const currentMonthTotalIncome = useTransactionStore((state) => state.currentMonthTotalIncome);
  const previousMonthTotalIncome = useTransactionStore((state) => state.previousMonthTotalIncome);
  const currentMonthTotalExpense = useTransactionStore((state) => state.currentMonthTotalExpense);
  const categoryBreakdown = useTransactionStore((state) => state.categoryWiseMonthlyExpense);
  const commonflowTable = useTransactionStore((state) => state.commonflowTable);
  const commonflowFilters = useTransactionStore((state) => state.commonflowFilters);
  const isLoadingCommonflowTable = useTransactionStore((state) => state.isLoadingCommonflowTable);
  const fetchAllAccounts = useAccountsStore((state) => state.fetchAllAccounts);
  const fetchTotalMonthlyIncome = useTransactionStore((state) => state.fetchMonthlyTotalIncome);
  const fetchTotalBalance = useAccountsStore((state) => state.fetchTotalBalance);
  const fetchMonthlyTotalExpense = useTransactionStore((state) => state.fetchMonthlyTotalExpense);
  const fetchCategoryWiseExpenses = useTransactionStore((state) => state.fetchCategoryWiseExpenses);
  const fetchAllTransactions = useTransactionStore((state) => state.fetchAllTransactions);
  const fetchTableCommonflow = useTransactionStore((state) => state.fetchTableCommonflow);
  const setCommonflowPage = useTransactionStore((state) => state.setCommonflowPage);
  // const setCommonflowLimit = useTransactionStore((state) => state.setCommonflowLimit);
  const setCommonflowTimeRange = useTransactionStore((state) => state.setCommonflowTimeRange);
  const setCommonflowCategory = useTransactionStore((state) => state.setCommonflowCategory);
  const setCommonflowTransactionType = useTransactionStore((state) => state.setCommonflowTransactionType);
  const setCommonflowSearchText = useTransactionStore((state) => state.setCommonflowSearchText);
  // const clearCommonflowFilters = useTransactionStore((state) => state.clearCommonflowFilters);
  const goToNextCommonflowPage = useTransactionStore((state) => state.goToNextCommonflowPage);
  const goToPrevCommonflowPage = useTransactionStore((state) => state.goToPrevCommonflowPage);

  const handleStore = useCallback(() => {
    fetchAllAccounts();
    fetchTotalMonthlyIncome();
    fetchTotalBalance();
    fetchMonthlyTotalExpense();
    fetchCategoryWiseExpenses();
    fetchAllTransactions();
    fetchTableCommonflow();
  }, [fetchAllAccounts, fetchTotalMonthlyIncome, fetchTotalBalance, fetchMonthlyTotalExpense, fetchCategoryWiseExpenses, fetchAllTransactions, fetchTableCommonflow]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  const importCloseModal = () => {
    setIsImportModalOpen(false);
    handleStore();
  };

  const accounts = [...bankAccounts, ...investmentAccounts, ...debtAccounts, ...liquidAccounts]

  // Filter transactions based on search term and filters
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommonflowSearchText(value);
  };

  const handleCategoryChange = (value: string) => {
    setCommonflowCategory(value === 'all-categories' ? '' : value);
  };

  const handleDateChange = (value: string) => {
    setCommonflowTimeRange(value);
  };

  const handleTabChange = (value: string) => {
    if (value === 'income') {
      setCommonflowTransactionType('INCOME');
    } else if (value === 'expense') { 
      setCommonflowTransactionType('EXPENSE');
    } else {
      setCommonflowTransactionType('');
    }
  };

  // Open the transaction modal for adding new transaction
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsEditing(false);
    setIsTransactionInputModalOpen(true);
  };
  
  // Open the transaction modal for editing an existing transaction
  const handleEditTransaction = (transaction: ITransaction) => {
    // Convert the Transaction format to ITransaction format for the modal
    const formattedTransaction: ITransaction = {
      _id: transaction._id?.toString(),
      user_id: 'user123',
      transaction_type: (transaction.transaction_type === 'INCOME' ? 'INCOME' : 'EXPENSE'),
      type: 'REGULAR',
      category: (transaction.category.toUpperCase() === 'RESTAURANT' ? 'FOOD' : 
                transaction.category.toUpperCase() === 'UTILITIES' ? 'BILLS' :
                transaction.category.toUpperCase() === 'SHOPPING MALL' ? 'SHOPPING' :
                transaction.category.toUpperCase() === 'SALARY DEPOSIT' ? 'SAVINGS' :
                transaction.category === 'TRANSPORT' ? 'TRANSPORT' :
                transaction.category === 'ENTERTAINMENT' ? 'ENTERTAINMENT' : 'MISCELLANEOUS') as ITransaction['category'],
      amount: Number(String(transaction.amount).replace(/[^0-9.-]+/g, '')),
      currency: 'INR',
      date: transaction.date || new Date().toISOString(),
      description: transaction.description || "Unknown",
      tags: transaction.tags || [],
      status: (transaction.status?.toUpperCase() === 'PENDING' ? 'PENDING' : transaction.status?.toUpperCase() === 'FAILED' ? 'FAILED' : 'COMPLETED') as 'COMPLETED' | 'PENDING' | 'FAILED',
      account_id: transaction.account_id || accounts[0]?._id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSelectedTransaction(formattedTransaction);
    setIsEditing(true);
    setIsTransactionInputModalOpen(true);
  };

  // Handle saving the transaction from modal
  const handleSaveTransaction = async (transactionData: ITransaction) => {
    if (transactionData.transaction_type === 'INCOME' && transactionData.type !== 'TRANSFER') {
      const accountDetails = accounts.filter((account) => account._id === transactionData.account_id);
      const newBalance = (accountDetails[0]?.current_balance || 0) + Number(transactionData.amount);
      accountDetails[0].current_balance = newBalance;
      await updateAccount(transactionData.account_id, {...accountDetails[0]});
    } else if (transactionData.transaction_type === 'EXPENSE' && transactionData.type !== 'TRANSFER') {
      const accountDetails = accounts.filter((account) => account._id === transactionData.account_id);
      const newBalance = (accountDetails[0]?.current_balance || 0) - Number(transactionData.amount);
      accountDetails[0].current_balance = newBalance;
      await updateAccount(transactionData.account_id, {...accountDetails[0]});
    } else if (transactionData.transaction_type === 'INCOME' && transactionData.type === 'TRANSFER') {
      const debitedAccountDetails = accounts.filter((account) => account._id === transactionData.account_id);
      const debtiedAccountBalance = (debitedAccountDetails[0]?.current_balance || 0) - Number(transactionData.amount);
      await updateAccount(transactionData.account_id, { ...debitedAccountDetails[0], current_balance: debtiedAccountBalance });
      const creditedAccountDetails = accounts.filter((account) => account._id === transactionData.related_account_id);
      const creditedAccountBalance = (creditedAccountDetails[0]?.current_balance || 0) + Number(transactionData.amount);
      await updateAccount(transactionData.related_account_id || '', { ...creditedAccountDetails[0], current_balance: creditedAccountBalance });
    } else if (transactionData.transaction_type === 'EXPENSE' && transactionData.type === 'TRANSFER') {
      const debitedAccountDetails = accounts.filter((account) => account._id === transactionData.account_id);
      const debtiedAccountBalance = (debitedAccountDetails[0]?.current_balance || 0) - Number(transactionData.amount);
      await updateAccount(transactionData.account_id, { ...debitedAccountDetails[0], current_balance: debtiedAccountBalance });
      const creditedAccountDetails = accounts.filter((account) => account._id === transactionData.related_account_id);
      const creditedAccountBalance = (creditedAccountDetails[0]?.current_balance || 0) - Number(transactionData.amount);
      await updateAccount(transactionData.related_account_id || '', { ...creditedAccountDetails[0], current_balance: creditedAccountBalance });
    }

    const isIncome = transactionData.transaction_type === 'INCOME';
    
    const newTransaction: ITransaction = {
      _id: isEditing ? String(transactionData._id) : undefined,
      user_id: 'user123',
      transaction_type: isIncome ? 'INCOME' : 'EXPENSE',
      type: 'REGULAR',
      category: transactionData.category,
      amount: Number(transactionData.amount),
      currency: 'INR',
      date: new Date().toISOString(),
      description: transactionData.description || "Unknown",
      tags: transactionData.tags || [],
      status: transactionData.status || 'COMPLETED',
      account_id: transactionData?.account_id || accounts[0]?._id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log(newTransaction);
    
    if (!isEditing) {
      const response = await addTransaction(transactionData);
      console.log(`Response`, response.data);
    }
    
    // Refresh the transaction list after adding/updating
    await fetchTableCommonflow();
  };

  return (
    <div className="w-full max-w-[1184px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`General Transactions`} tag={`Financial Management Center`} />

      <div className="space-y-8">
        {/* Financial Summary Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Inflow</p>
                    <p className="text-lg font-semibold text-emerald-500">₹ {currentMonthTotalIncome ? currentMonthTotalIncome.toFixed(2) : 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Outflow</p>
                    <p className="text-lg font-semibold text-red-500">₹ -{currentMonthTotalExpense ? currentMonthTotalExpense.toFixed(2) : 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Balance</p>
                    <p className="text-lg font-semibold text-[#004a7c]">₹ {totalBalance ? totalBalance.toFixed(2) : 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Savings Rate</p>
                    <p className="text-lg font-semibold text-[#00a9e0]">
                      {previousMonthTotalIncome === 0
                        ? currentMonthTotalIncome > 0 ? '100%' : '0%'
                        : `${(((currentMonthTotalIncome - previousMonthTotalIncome) / Math.abs(previousMonthTotalIncome)) * 100).toFixed(2)} %`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-indigo-600'} mr-2`}></div>
                        <span className="text-sm">{category.category}</span>
                      </div>
                      <span className="text-sm font-medium">₹ {category.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* General Transactions Section */}
        <section>
          <div className="space-y-6">
            <div className="flex justify-end items-center">
              <div className="flex gap-3 mr-3">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200 flex items-center gap-2 h-[42px] px-5 rounded-full transition-all duration-300 transform hover:scale-105"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Import Transaction
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200 flex items-center gap-2 h-[42px] px-5 rounded-full transition-all duration-300 transform hover:scale-105"
                  onClick={handleAddTransaction}
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Add Transaction
                </Button>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        className="w-full h-10 pl-10"
                        placeholder="Search transactions..."
                        value={commonflowFilters.searchText}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Select value={commonflowFilters.timeRange} onValueChange={handleDateChange}>
                      <SelectTrigger className="w-full md:w-40 h-10">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {showFilters && (
                  <div className="flex flex-col md:flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
                    <Select value={commonflowFilters.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full md:w-48 h-10">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all-categories">All Categories</SelectItem>
                        <SelectItem value="restaurant">Food & Dining</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="border-b px-6 py-4 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <CardTitle className="text-lg text-[#004a7c]">Transaction History</CardTitle>
                  <Tabs value={commonflowFilters.transactionType === 'INCOME' ? 'income' : commonflowFilters.transactionType === 'EXPENSE' ? 'expenses' : 'all'  } onValueChange={handleTabChange} className="w-auto">
                    <TabsList className="grid grid-cols-3 w-full md:w-64">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="expense">Expenses</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Description</TableHead>
                      <TableHead className="font-medium">Transaction Type</TableHead>
                      <TableHead className="font-medium">Credit</TableHead>
                      <TableHead className="font-medium">Debit</TableHead>
                      <TableHead className="font-medium">Tags</TableHead>
                      <TableHead className="font-medium text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {isLoadingCommonflowTable ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Loading transactions...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : commonflowTable.data.length > 0 ? (
                    commonflowTable.data.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <TableCell>
                          <p className="text-sm">{new Date(transaction.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}</p>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center">
                            <div>
                              <p className="text-base font-medium">
                                {
                                  transaction.description ? (transaction.description.length > 30 ?
                                  transaction.description.substring(0, 30) + '...' :
                                  transaction.description) : 'No Description'
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.transaction_type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.transaction_type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-right font-medium text-emerald-500"
                        >
                          {transaction.transaction_type === 'INCOME' ? `₹ ${transaction.credit_amount?.toFixed(2) || transaction.amount.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell
                          className="text-right font-medium text-red-500"
                        >
                          {transaction.transaction_type === 'EXPENSE' ? `₹ ${transaction.debit_amount?.toFixed(2) || transaction.amount.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {transaction.tags && transaction.tags.length > 0 ? transaction.tags.map((tag, i) => (
                              <div key={i} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                                <Tag className="w-3 h-3 mr-1" /> {tag}
                              </div>
                            )) : (
                              <span className="text-xs text-gray-500">No tags</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            transaction.transaction_type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {transaction.transaction_type === 'INCOME' ? 
                            `+₹ ${transaction.amount.toFixed(2)}` : 
                            `-₹ ${transaction.amount.toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="rounded-full bg-gray-100 p-3 mb-4">
                            <Search className="w-6 h-6 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                          <p className="text-gray-500">Try adjusting your filters or search term</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </Table>
              </CardContent>
              
              <div className="bg-white">
                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-600 text-sm">
                    Showing <span className="font-medium">{((commonflowFilters.page - 1) * commonflowFilters.limit) + 1}</span> to <span className="font-medium">{Math.min(commonflowFilters.page * commonflowFilters.limit, commonflowTable.total)}</span> of <span className="font-medium">{commonflowTable.total}</span> entries
                  </p>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={goToPrevCommonflowPage}
                      disabled={commonflowFilters.page === 1}
                      className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        commonflowFilters.page === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </button>
                    
                    <div className="hidden md:flex">
                      {Array.from({ length: Math.min(commonflowTable.totalPages, 5) }, (_, i) => {
                        const pageToShow = commonflowTable.totalPages <= 5 
                          ? i + 1 
                          : commonflowFilters.page <= 3 
                            ? i + 1 
                            : commonflowFilters.page >= commonflowTable.totalPages - 2 
                              ? commonflowTable.totalPages - 4 + i 
                              : commonflowFilters.page - 2 + i;
                      
                        return (
                          <button
                            key={pageToShow}
                            onClick={() => setCommonflowPage(pageToShow)}
                            className={`w-10 h-10 flex items-center justify-center rounded-md mx-1 text-sm font-medium transition-colors ${
                              commonflowFilters.page === pageToShow
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageToShow}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="md:hidden flex items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Page {commonflowFilters.page} of {commonflowTable.totalPages}
                      </span>
                    </div>
                    
                    <button
                      onClick={goToNextCommonflowPage}
                      disabled={commonflowFilters.page === commonflowTable.totalPages}
                      className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        commonflowFilters.page === commonflowTable.totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Next page"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Financial Calendar Section */}
        <section>
          <AdvancedFinancialCalendar />
        </section>
      </div>

      {/* Transaction Input Modal */}
      <TransactionInputModal
        isOpen={isTransactionInputModalOpen}
        onClose={async () => { 
          await handleStore();
          setIsTransactionInputModalOpen(false)
        }}
        onSaveTransaction={handleSaveTransaction}
        accounts={accounts}
        initialData={selectedTransaction}
        isEditing={isEditing}
      />

      {/* Import Modal */}
      <ImportModal isOpen={isImportModalOpen} onClose={importCloseModal}>
        <BankStatementUploader onClose={importCloseModal} />
      </ImportModal>
    </div>
  );
};

export default TransactionBody;
