import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, IndianRupee } from 'lucide-react';
import useTransactionStore from '@/stores/transaction/transactionStore';
import useDebouncedValue from '@/hooks/useDebouncedValue';

const OutflowTableComponent = () => {
  const {
    OutflowTable,
    OutflowFilters,
    isLoadingOutflowTable,
    fetchTableOutflow,
    setOutflowPage,
    setOutflowLimit,
    setOutflowTimeRange,
    setOutflowCategory,
    setOutflowSearchText,
    clearOutflowFilters,
  } = useTransactionStore();

  const [searchInput, setSearchInput] = useState(OutflowFilters.searchText);
  const debouncedSearchInput = useDebouncedValue(searchInput, 500);

  // Get unique categories from actual transaction data
  const availableCategories = useMemo(() => {
    if (!OutflowTable?.data?.length) return [];
    
    const categories = [...new Set(OutflowTable.data.map(transaction => transaction.category))];
    return categories.filter(Boolean).sort();
  }, [OutflowTable?.data]);

  // Fetch initial data on mount
  useEffect(() => {
    fetchTableOutflow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Always fetch on mount

  // Handle filter changes (separate from initial load)
  useEffect(() => {
    // Only fetch if we have meaningful filter changes and not initial load
    if (OutflowFilters.searchText || 
        OutflowFilters.category || 
        OutflowFilters.timeRange !== 'year' || 
        OutflowFilters.page !== 1 || 
        OutflowFilters.limit !== 10) {
      fetchTableOutflow();
    }
  }, [
    OutflowFilters.searchText,
    OutflowFilters.category, 
    OutflowFilters.timeRange,
    OutflowFilters.page,
    OutflowFilters.limit,
    fetchTableOutflow
  ]);

  // Debounced search with cleanup
  useEffect(() => {
   if (debouncedSearchInput !== OutflowFilters.searchText) {
    setOutflowSearchText(debouncedSearchInput);
   }
  }, [debouncedSearchInput, setOutflowSearchText, OutflowFilters.searchText]);

  // Memoized event handlers to prevent re-renders
  const handlePageClick = useCallback((pageNumber: number) => {
    if (pageNumber !== OutflowFilters.page && pageNumber >= 1 && pageNumber <= OutflowTable.totalPages) {
      setOutflowPage(pageNumber);
    }
  }, [OutflowFilters.page, OutflowTable.totalPages, setOutflowPage]);

  const handlePreviousPage = useCallback(() => {
    if (OutflowFilters.page > 1) {
      setOutflowPage(OutflowFilters.page - 1);
    }
  }, [OutflowFilters.page, setOutflowPage]);

  const handleNextPage = useCallback(() => {
    if (OutflowFilters.page < OutflowTable.totalPages) {
      setOutflowPage(OutflowFilters.page + 1);
    }
  }, [OutflowFilters.page, OutflowTable.totalPages, setOutflowPage]);

  const handleLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    if (newLimit !== OutflowFilters.limit) {
      setOutflowLimit(newLimit);
      // Reset to page 1 when changing limit
      if (OutflowFilters.page !== 1) {
        setOutflowPage(1);
      }
    }
  }, [OutflowFilters.limit, OutflowFilters.page, setOutflowLimit, setOutflowPage]);

  const handleTimeRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeRange = e.target.value;
    if (newTimeRange !== OutflowFilters.timeRange) {
      setOutflowTimeRange(newTimeRange);
      // Reset to page 1 when changing time range
      if (OutflowFilters.page !== 1) {
        setOutflowPage(1);
      }
    }
  }, [OutflowFilters.timeRange, OutflowFilters.page, setOutflowTimeRange, setOutflowPage]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    if (newCategory !== OutflowFilters.category) {
      setOutflowCategory(newCategory);
      // Reset to page 1 when changing category
      if (OutflowFilters.page !== 1) {
        setOutflowPage(1);
      }
    }
  }, [OutflowFilters.category, OutflowFilters.page, setOutflowCategory, setOutflowPage]);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    clearOutflowFilters();
  }, [clearOutflowFilters]);

  // Memoized utility functions
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  }, []);

  const formattedDate = useCallback((dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const getCategoryDisplayName = useCallback((category: string) => {
    const categoryMap: Record<string, string> = {
      'SAVINGS': 'Savings',
      'INVESTMENTS': 'Investment',
      'MISCELLANEOUS': 'Miscellaneous',
      'BUSINESS': 'Business',
      'SALARY': 'Salary',
      'RENTAL': 'Rental'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }, []);

  // Memoized pagination calculation
  const paginationPages = useMemo(() => {
    if (!OutflowTable.totalPages || OutflowTable.totalPages <= 1) return [];
    
    const pages = [];
    const currentPage = OutflowFilters.page;
    const totalPages = OutflowTable.totalPages;
    
    // Always show first page
    pages.push(1);
    
    // Add pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  }, [OutflowFilters.page, OutflowTable.totalPages]);

  // Initial loading state with skeleton
  if (isLoadingOutflowTable && !OutflowTable?.data?.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        {/* Search and Filters Skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-80">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Transaction List Skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={OutflowFilters.timeRange}
          onChange={handleTimeRangeChange}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="year">This Year</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>

        <select
          value={OutflowFilters.category}
          onChange={handleCategoryChange}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {getCategoryDisplayName(category)}
            </option>
          ))}
        </select>

        <select
          value={OutflowFilters.limit}
          onChange={handleLimitChange}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <button
          onClick={handleClearFilters}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Inflow Transactions</h2>
        <div className="text-sm text-gray-500">
          Showing {OutflowTable?.data?.length || 0} of {OutflowTable?.total || 0} transactions
        </div>
      </div>
      
      {/* Transaction List with Loading Overlay */}
      <div className="relative">
        {isLoadingOutflowTable && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Updating...</span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {OutflowTable?.data?.length > 0 ? (
            OutflowTable.data.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formattedDate(transaction.date)}</span>
                      <span>•</span>
                      <span className="capitalize">{getCategoryDisplayName(transaction.category)}</span>
                      {transaction.transaction_type && (
                        <>
                          <span>•</span>
                          <span className='text-gray-600'>
                            {transaction.transaction_type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  +{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {OutflowTable.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={OutflowFilters.page === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              OutflowFilters.page === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {paginationPages.map((page, index) => (
              <React.Fragment key={`${page}-${index}`}>
                {page === '...' ? (
                  <span className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => handlePageClick(typeof page === 'string' ? parseInt(page) : page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      OutflowFilters.page === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={OutflowFilters.page === OutflowTable.totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              OutflowFilters.page === OutflowTable.totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OutflowTableComponent;
