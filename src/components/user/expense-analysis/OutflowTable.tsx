import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, IndianRupee } from 'lucide-react';

import { useTransactionStore } from '@/stores/store';

const OutflowTableComponent = () => {
  const {
    inflowTable,
    inflowFilters,
    isLoadingInflowTable,
    fetchTableInflow,
    setInflowPage,
    setInflowLimit,
    setInflowTimeRange,
    setInflowCategory,
    setInflowSearchText,
    clearInflowFilters,
  } = useTransactionStore();

  const [searchInput, setSearchInput] = useState(inflowFilters.searchText);

  // Get unique categories from actual transaction data
  const availableCategories = useMemo(() => {
    if (!inflowTable?.data?.length) return [];
    
    const categories = [...new Set(inflowTable.data.map(transaction => transaction.category))];
    return categories.filter(Boolean).sort();
  }, [inflowTable?.data]);

  // Fetch initial data on mount
  useEffect(() => {
    fetchTableInflow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Always fetch on mount

  // Handle filter changes (separate from initial load)
  useEffect(() => {
    // Only fetch if we have meaningful filter changes and not initial load
    if (inflowFilters.searchText || 
        inflowFilters.category || 
        inflowFilters.timeRange !== 'year' || 
        inflowFilters.page !== 1 || 
        inflowFilters.limit !== 10) {
      fetchTableInflow();
    }
  }, [
    inflowFilters.searchText,
    inflowFilters.category, 
    inflowFilters.timeRange,
    inflowFilters.page,
    inflowFilters.limit,
    fetchTableInflow
  ]);

  // Debounced search with cleanup
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchInput !== inflowFilters.searchText) {
        setInflowSearchText(searchInput);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchInput, setInflowSearchText, inflowFilters.searchText]);

  // Memoized event handlers to prevent re-renders
  const handlePageClick = useCallback((pageNumber: number) => {
    if (pageNumber !== inflowFilters.page && pageNumber >= 1 && pageNumber <= inflowTable.totalPages) {
      setInflowPage(pageNumber);
    }
  }, [inflowFilters.page, inflowTable.totalPages, setInflowPage]);

  const handlePreviousPage = useCallback(() => {
    if (inflowFilters.page > 1) {
      setInflowPage(inflowFilters.page - 1);
    }
  }, [inflowFilters.page, setInflowPage]);

  const handleNextPage = useCallback(() => {
    if (inflowFilters.page < inflowTable.totalPages) {
      setInflowPage(inflowFilters.page + 1);
    }
  }, [inflowFilters.page, inflowTable.totalPages, setInflowPage]);

  const handleLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    if (newLimit !== inflowFilters.limit) {
      setInflowLimit(newLimit);
      // Reset to page 1 when changing limit
      if (inflowFilters.page !== 1) {
        setInflowPage(1);
      }
    }
  }, [inflowFilters.limit, inflowFilters.page, setInflowLimit, setInflowPage]);

  const handleTimeRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeRange = e.target.value;
    if (newTimeRange !== inflowFilters.timeRange) {
      setInflowTimeRange(newTimeRange);
      // Reset to page 1 when changing time range
      if (inflowFilters.page !== 1) {
        setInflowPage(1);
      }
    }
  }, [inflowFilters.timeRange, inflowFilters.page, setInflowTimeRange, setInflowPage]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    if (newCategory !== inflowFilters.category) {
      setInflowCategory(newCategory);
      // Reset to page 1 when changing category
      if (inflowFilters.page !== 1) {
        setInflowPage(1);
      }
    }
  }, [inflowFilters.category, inflowFilters.page, setInflowCategory, setInflowPage]);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    clearInflowFilters();
  }, [clearInflowFilters]);

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
    if (!inflowTable.totalPages || inflowTable.totalPages <= 1) return [];
    
    const pages = [];
    const currentPage = inflowFilters.page;
    const totalPages = inflowTable.totalPages;
    
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
  }, [inflowFilters.page, inflowTable.totalPages]);

  // Initial loading state with skeleton
  if (isLoadingInflowTable && !inflowTable?.data?.length) {
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
          value={inflowFilters.timeRange}
          onChange={handleTimeRangeChange}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="year">This Year</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>

        <select
          value={inflowFilters.category}
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
          value={inflowFilters.limit}
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
          Showing {inflowTable?.data?.length || 0} of {inflowTable?.total || 0} transactions
        </div>
      </div>
      
      {/* Transaction List with Loading Overlay */}
      <div className="relative">
        {isLoadingInflowTable && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Updating...</span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {inflowTable?.data?.length > 0 ? (
            inflowTable.data.map((transaction) => (
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
      {inflowTable.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={inflowFilters.page === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              inflowFilters.page === 1
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
                      inflowFilters.page === page
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
            disabled={inflowFilters.page === inflowTable.totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              inflowFilters.page === inflowTable.totalPages
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
