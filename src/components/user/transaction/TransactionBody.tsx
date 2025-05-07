"use client";
import { Plus, Search, Filter, Calendar, PieChart, ChevronRight, Tag, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/Tabs';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import AdvancedFinancialCalendar from './AdvancedFinancialCalendar';

const TransactionBody = function () {
  type IconPath = '/restaurant_icon.svg' | '/shopping_bag_icon.svg' | '/bank_icon.svg' | '/transport_icon.svg' | '/utilities_icon.svg' | '/entertainment_icon.svg';
  
  interface Transaction {
    id: number;
    category: string;
    merchant: string;
    date: string;
    amount: string;
    amountColor: string;
    icon: IconPath;
    status?: string;
    tags?: string[];
  }

  // Enhanced transaction data
  const allTransactions: Transaction[] = [
    {
      id: 1,
      category: "Restaurant",
      merchant: "Fusion Bistro",
      date: "Today, 2:30 PM",
      amount: "-$42.50",
      amountColor: "text-red-500",
      icon: "/restaurant_icon.svg",
      status: "Completed",
      tags: ["Dining", "Personal"]
    },
    {
      id: 2,
      category: "Shopping Mall",
      merchant: "Urban Outfitters",
      date: "Yesterday",
      amount: "-$128.99",
      amountColor: "text-red-500",
      icon: "/shopping_bag_icon.svg",
      status: "Completed",
      tags: ["Clothing", "Personal"]
    },
    {
      id: 3,
      category: "Salary Deposit",
      merchant: "ABC Corporation",
      date: "Mar 1, 2025",
      amount: "+$3,500.00",
      amountColor: "text-emerald-500",
      icon: "/bank_icon.svg",
      status: "Completed",
      tags: ["Income"]
    },
    {
      id: 4,
      category: "Transport",
      merchant: "Uber",
      date: "Feb 28, 2025",
      amount: "-$24.75",
      amountColor: "text-red-500",
      icon: "/transport_icon.svg",
      status: "Completed",
      tags: ["Travel"]
    },
    {
      id: 5,
      category: "Utilities",
      merchant: "Power Company",
      date: "Feb 25, 2025",
      amount: "-$95.20",
      amountColor: "text-red-500",
      icon: "/utilities_icon.svg",
      status: "Pending",
      tags: ["Bills", "Home"]
    },
    {
      id: 6,
      category: "Entertainment",
      merchant: "Cinema Complex",
      date: "Feb 22, 2025",
      amount: "-$32.00",
      amountColor: "text-red-500",
      icon: "/entertainment_icon.svg",
      status: "Completed",
      tags: ["Leisure", "Personal"]
    },
  ];

  // Financial summary data
  const financialSummary = {
    totalIncome: "+$3,500.00",
    totalExpenses: "-$323.44",
    netBalance: "+$3,176.56",
    savingsRate: "28%"
  };

  // Category breakdown data for the chart
  const categoryBreakdown = [
    { name: "Food & Dining", value: 42.5, percentage: "13%" },
    { name: "Shopping", value: 128.99, percentage: "40%" },
    { name: "Transport", value: 24.75, percentage: "8%" },
    { name: "Utilities", value: 95.2, percentage: "29%" },
    { name: "Entertainment", value: 32, percentage: "10%" }
  ];

  // Upcoming bills
  const upcomingBills = [
    { name: "Rent", amount: "$1,200.00", dueDate: "May 15, 2025" },
    { name: "Electric Bill", amount: "$87.50", dueDate: "May 20, 2025" },
    { name: "Internet", amount: "$65.00", dueDate: "May 22, 2025" }
  ];

  // State for filtering and pagination
  const [transactions, setTransactions] = useState(allTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all-categories');
  const [dateFilter, setDateFilter] = useState('last-30-days');
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const itemsPerPage = 5;

  // Transaction form state
  const [newTransaction, setNewTransaction] = useState({
    category: '',
    merchant: '',
    amount: '',
    date: '',
    tags: ''
  });

  // Placeholders for icons - in a real app these would be actual image paths
  const iconPlaceholders = {
    '/restaurant_icon.svg': '/restaurant_icon.svg',
    '/shopping_bag_icon.svg': '/shopping_bag_icon.svg',
    '/bank_icon.svg': '/bank_icon.svg',
    '/transport_icon.svg': '/transport_icon.svg',
    '/utilities_icon.svg': '/utilities_icon.svg',
    '/entertainment_icon.svg': '/entertainment_icon.svg'
  };

  // Filter transactions based on search term and filters
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterTransactions(value, categoryFilter, dateFilter, statusFilter);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    filterTransactions(searchTerm, value, dateFilter, statusFilter);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    filterTransactions(searchTerm, categoryFilter, value, statusFilter);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    filterTransactions(searchTerm, categoryFilter, dateFilter, value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'income') {
      setTransactions(allTransactions.filter(t => t.amountColor === 'text-emerald-500'));
    } else if (value === 'expenses') {
      setTransactions(allTransactions.filter(t => t.amountColor === 'text-red-500'));
    } else {
      setTransactions(allTransactions);
    }
    
    setCurrentPage(1);
  };

  const filterTransactions = (search: string, category: string, date: string, status: string) => {
    let filtered = allTransactions;
    
    // Apply tab filter first
    if (activeTab === 'income') {
      filtered = filtered.filter(t => t.amountColor === 'text-emerald-500');
    } else if (activeTab === 'expenses') {
      filtered = filtered.filter(t => t.amountColor === 'text-red-500');
    }
    
    if (search) {
      filtered = filtered.filter(transaction => 
        transaction.category.toLowerCase().includes(search.toLowerCase()) ||
        transaction.merchant.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== 'all-categories') {
      filtered = filtered.filter(transaction => 
        transaction.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (status !== 'all-statuses' && status) {
      filtered = filtered.filter(transaction => 
        transaction.status?.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Date filtering is simplified for demo purposes
    if (date === 'last-30-days') {
      // All transactions are within 30 days in our demo
    } else if (date === 'last-90-days') {
      // All transactions are within 90 days in our demo
    } else if (date === 'this-year') {
      // All transactions are within this year in our demo
    }
    
    setTransactions(filtered);
    setCurrentPage(1);
  };

  // Handle transaction form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your backend API
    console.log("New transaction submitted:", newTransaction);
    
    // For demo purposes, we'll add it to our local state
    const newId = allTransactions.length + 1;
    const isIncome = newTransaction.amount.trim().startsWith('+');
    
    const newTransactionObj: Transaction = {
      id: newId,
      category: newTransaction.category,
      merchant: newTransaction.merchant,
      date: newTransaction.date || 'Today',
      amount: isIncome ? newTransaction.amount : `-${newTransaction.amount.replace(/^\+|-/, '')}`,
      amountColor: isIncome ? 'text-emerald-500' : 'text-red-500',
      icon: newTransaction.category.toLowerCase().includes('restaurant') 
        ? '/restaurant_icon.svg' 
        : newTransaction.category.toLowerCase().includes('shopping')
          ? '/shopping_bag_icon.svg'
          : '/bank_icon.svg',
      status: 'Completed',
      tags: newTransaction.tags ? newTransaction.tags.split(',').map(tag => tag.trim()) : []
    };
    
    // Add to transactions and reset form
    setTransactions([newTransactionObj, ...transactions]);
    setNewTransaction({
      category: '',
      merchant: '',
      amount: '',
      date: '',
      tags: ''
    });
    setShowTransactionForm(false);
  };

  // Calculate pagination
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="w-full max-w-[1184px] mx-auto">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`General Transactions`} tag={`Financial Management Center`} />

      <div className="space-y-8">
        {/* Financial Summary Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Income</p>
                    <p className="text-lg font-semibold text-emerald-500">{financialSummary.totalIncome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="text-lg font-semibold text-red-500">{financialSummary.totalExpenses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Balance</p>
                    <p className="text-lg font-semibold text-[#004a7c]">{financialSummary.netBalance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Savings Rate</p>
                    <p className="text-lg font-semibold text-[#00a9e0]">{financialSummary.savingsRate}</p>
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
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">{category.percentage}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button className="p-2">
                    <PieChart className="w-4 h-4 mr-1" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Upcoming Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {upcomingBills.map((bill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{bill.name}</p>
                        <p className="text-xs text-gray-500">Due {bill.dueDate}</p>
                      </div>
                      <p className="text-sm font-semibold">{bill.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="mt-4 mr-6 mb-8 flex justify-end">
                <Button className="p-2">
                  <ChevronRight className="w-4 h-4 mr-1" /> View All Bills 
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Add Transaction Form */}
        {showTransactionForm && (
          <section>
            <Card className="shadow-md border border-blue-100">
              <CardHeader className="border-b bg-blue-50">
                <CardTitle className="text-lg text-blue-700">Add New Transaction</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Merchant</label>
                    <Input 
                      name="merchant"
                      value={newTransaction.merchant}
                      onChange={handleFormChange}
                      placeholder="Enter merchant name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Input 
                      name="category"
                      value={newTransaction.category}
                      onChange={handleFormChange}
                      placeholder="Enter transaction category"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <Input 
                      name="amount"
                      value={newTransaction.amount}
                      onChange={handleFormChange}
                      placeholder="Enter amount (e.g. +50.00 or -25.99)"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <Input 
                      name="date"
                      value={newTransaction.date}
                      onChange={handleFormChange}
                      placeholder="Today"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <Input 
                      name="tags"
                      value={newTransaction.tags}
                      onChange={handleFormChange}
                      placeholder="e.g. Food, Personal, Bills"
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowTransactionForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save Transaction
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        )}

        {/* General Transactions Section */}
        <section>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div></div>
              <div className="flex gap-3">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  onClick={() => setShowTransactionForm(!showTransactionForm)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showTransactionForm ? "Hide Form" : "Add Transaction"}
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
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="h-10"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {showFilters ? "Hide Filters" : "Filters"}
                    </Button>
                    
                    <Select value={dateFilter} onValueChange={handleDateChange}>
                      <SelectTrigger className="w-full md:w-40 h-10">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {showFilters && (
                  <div className="flex flex-col md:flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
                    <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full md:w-48 h-10">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">All Categories</SelectItem>
                        <SelectItem value="restaurant">Food & Dining</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full md:w-48 h-10">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-statuses">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
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
                  <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
                    <TabsList className="grid grid-cols-3 w-full md:w-64">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium">Merchant & Category</TableHead>
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Tags</TableHead>
                      <TableHead className="font-medium text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <Image
                                alt={transaction.category}
                                src={iconPlaceholders[transaction.icon]}
                                width={14}
                                height={16}
                              />
                            </div>
                            <div>
                              <p className="text-base font-medium">
                                {transaction.merchant}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{transaction.date}</p>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {transaction.tags?.map((tag, i) => (
                              <div key={i} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                                <Tag className="w-3 h-3 mr-1" /> {tag}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${transaction.amountColor}`}
                        >
                          {transaction.amount}
                        </TableCell>
                      </TableRow>
                    ))}
          
                    {currentTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center">
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
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{transactions.length}</span> entries
                  </p>
        
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </button>

                    <div className="hidden md:flex">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        // Display page numbers around the current page
                        const pageToShow = totalPages <= 5 
                          ? i + 1 
                          : currentPage <= 3 
                            ? i + 1 
                            : currentPage >= totalPages - 2 
                              ? totalPages - 4 + i 
                              : currentPage - 2 + i;

                        return (
                          <button
                            key={pageToShow}
                            onClick={() => setCurrentPage(pageToShow)}
                            className={`w-10 h-10 flex items-center justify-center rounded-md mx-1 text-sm font-medium transition-colors ${
                              currentPage === pageToShow
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
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === totalPages
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
    </div>
  );
};

export default TransactionBody;
