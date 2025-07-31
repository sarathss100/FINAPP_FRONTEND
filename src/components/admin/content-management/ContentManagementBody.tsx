"use client";
import { Search, Plus, Edit, Trash, Eye, EyeOff, Save, X, SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Input from '@/components/base/Input';
import useFaqStore from '@/stores/faqs/faqStore';
import { IFaq } from '@/types/IFaq';
import { toast } from 'react-toastify';
import { addFaq, removeFaq, togglePublish, updateFaq } from '@/service/adminService';
import useDebouncedValue from "@/hooks/useDebouncedValue";

const FAQManagement = function () {
  const faqs = useFaqStore((state) => state.allFaqs);
  const paginationMeta = useFaqStore((state) => state.paginationMeta);
  const isLoading = useFaqStore((state) => state.isLoading);
  const fetchAllFaqs = useFaqStore((state) => state.fetchAllFaqs);
  const persistedState = useFaqStore((state) => state.persistedState);
  const updatePersistedState = useFaqStore((state) => state.updatePersistedState);

  // Initialize state from persisted values or defaults
  const [searchTerm, setSearchTerm] = useState(persistedState.searchTerm || '');
  const [currentPage, setCurrentPage] = useState(persistedState.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(persistedState.itemsPerPage || 10);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isPublished: true
  });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const handleFetchFaqs = useCallback((page = 1, limit = 10, search = '') => {
    fetchAllFaqs(page, limit, search);
  }, [fetchAllFaqs]);

  // Single useEffect to handle all data fetching
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // If search term changed, reset to page 1
    if (searchTerm !== persistedState.searchTerm) {
      setCurrentPage(1);
    }

    // Set up debounced search
    const timeout = setTimeout(() => {
      const pageToFetch = debouncedSearchTerm !== persistedState.searchTerm ? 1 : currentPage;
      handleFetchFaqs(pageToFetch, itemsPerPage, searchTerm);
      
      // Update persisted state
      updatePersistedState({
        searchTerm: debouncedSearchTerm,
        currentPage: pageToFetch,
        itemsPerPage
      });
    }, searchTerm ? 500 : 0); 

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, currentPage, itemsPerPage, handleFetchFaqs, persistedState.searchTerm, updatePersistedState]);

  const handleAdd = async () => {
    try {
      if (formData.question.trim() && formData.answer.trim()) {
        const newFaq = {
          question: formData.question,
          answer: formData.answer,
          isDeleted: false,
          isPublished: formData.isPublished,
        };
  
        const response = await addFaq(newFaq);

        if (response.success) {
          toast.success(response.message || 'FAQ Added Successfully');
          handleFetchFaqs(currentPage, itemsPerPage, searchTerm);
          setFormData({ question: '', answer: '', isPublished: true });
          setShowAddForm(false);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
    }
  };

  const handleEdit = (faq: IFaq) => {
    setEditingFaq(faq._id ?? null);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isPublished: faq.isPublished ?? true
    });
  };

  const handleUpdate = async () => {
    try {
      if (formData.question.trim() && formData.answer.trim() && editingFaq) {
        const newFaq = {
          question: formData.question,
          answer: formData.answer,
          isDeleted: false,
          isPublished: formData.isPublished,
        };
  
        const response = await updateFaq(editingFaq, newFaq);

        if (response.success) {
          toast.success(response.message || 'FAQ Updated Successfully');
          handleFetchFaqs(currentPage, itemsPerPage, searchTerm);
          setFormData({ question: '', answer: '', isPublished: true });
          setEditingFaq(null);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
    }
  };

  const handleDelete = async (id: string) => {
    try {
        const response = await removeFaq(id);

        if (response.success) {
          toast.success(response.message || 'FAQ Removed Successfully');
          setDeleteConfirmationId(null);
          handleFetchFaqs(currentPage, itemsPerPage, searchTerm);
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
    }
  };

  const togglePublished = async (id: string) => {
    try {
      const response = await togglePublish(id);

      if (response.success) {
        toast.success(response.message || 'FAQ Updated Successfully');
        handleFetchFaqs(currentPage, itemsPerPage, searchTerm);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', isPublished: true });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = paginationMeta.totalPages;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const current = paginationMeta.currentPage;
      const start = Math.max(1, current - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <main className="w-full max-w-[1296px] p-8">
      {/* FAQ Management Section */}
      <section>
        <div className="mb-8 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl text-[#004a7c] font-['Poppins',Helvetica] leading-[30px] mb-2">
                Content Management
              </h1>
              <p className="text-base text-gray-600 font-['Poppins',Helvetica] leading-4">
                Manage frequently asked questions and answers
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-[#00a9e0] text-white rounded-lg h-10 px-4 flex items-center gap-2 hover:bg-[#0088b8]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-gray-100 text-gray-700 font-normal">
              {paginationMeta.totalItems} Total FAQs
            </Badge>
            <Badge className="bg-green-100 text-green-700 font-normal">
              {faqs.filter(faq => faq.isPublished).length} Published
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-700 font-normal">
              {faqs.filter(faq => !faq.isPublished).length} Draft
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search FAQs..."
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a9e0] focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingFaq) && (
          <Card className="mb-6 mx-4 rounded-xl shadow-[0px_1px_2px_#0000000d] border-0">
            <CardContent className="p-6">
              <h3 className="text-xl text-[#004a7c] font-['Poppins',Helvetica] mb-4">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    placeholder="Enter the question..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                    placeholder="Enter the answer..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a9e0] focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    className="w-4 h-4 text-[#00a9e0] border-gray-300 rounded focus:ring-[#00a9e0]"
                  />
                  <label htmlFor="isPublished" className="text-sm text-gray-700">
                    Publish immediately
                  </label>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={editingFaq ? handleUpdate : handleAdd}
                    className="bg-[#00a9e0] text-white rounded-lg h-10 px-4 flex items-center gap-2 hover:bg-[#0088b8]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingFaq ? 'Update' : 'Save'} FAQ</span>
                  </Button>
                  <Button
                    onClick={cancelForm}
                    className="bg-gray-200 text-gray-700 rounded-lg h-10 px-4 flex items-center gap-2 hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a9e0]"></div>
          </div>
        )}

        {/* FAQ List */}
        {!isLoading && (
          <div className="space-y-4 px-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="rounded-xl shadow-[0px_1px_2px_#0000000d] border-0"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-[#004a7c] font-['Poppins',Helvetica] font-medium">
                          {faq.question}
                        </h3>
                        <Badge className={`${faq.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} font-normal`}>
                          {faq.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 font-['Poppins',Helvetica] mb-3">
                        {faq.answer}
                      </p>
                      <div className="text-xs text-gray-400">
                        Created: {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString() : 'N/A'} | 
                        Updated: {faq.updatedAt ? new Date(faq.updatedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Button
                      onClick={() => handleEdit(faq)}
                      className="bg-blue-50 text-blue-600 rounded-lg h-8 px-3 flex items-center gap-1 hover:bg-blue-100 text-sm"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    
                    <Button
                      onClick={() => togglePublished(faq._id ?? '')}
                      className={`${faq.isPublished ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} rounded-lg h-8 px-3 flex items-center gap-1 text-sm`}
                    >
                      {faq.isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {faq.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    
                    <Button
                      onClick={() => setDeleteConfirmationId(faq._id ?? '')}
                      className="bg-red-50 text-red-600 rounded-lg h-8 px-3 flex items-center gap-1 hover:bg-red-100 text-sm"
                    >
                      <Trash className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {faqs.length === 0 && (
              <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d] border-0">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <SearchIcon className="w-12 h-12 mx-auto mb-3" />
                  </div>
                  <h3 className="text-lg text-gray-600 font-['Poppins',Helvetica] mb-2">
                    {searchTerm ? 'No FAQs found' : 'No FAQs yet'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first FAQ'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && paginationMeta.totalPages > 1 && (
          <div className="mt-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min((paginationMeta.currentPage - 1) * paginationMeta.itemsPerPage + 1, paginationMeta.totalItems)} to {Math.min(paginationMeta.currentPage * paginationMeta.itemsPerPage, paginationMeta.totalItems)} of {paginationMeta.totalItems} entries
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(paginationMeta.currentPage - 1)}
                  disabled={!paginationMeta.hasPreviousPage}
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg h-10 px-3 flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <Button
                          onClick={() => handlePageChange(page as number)}
                          className={`h-10 px-3 rounded-lg text-sm ${
                            page === paginationMeta.currentPage
                              ? 'bg-[#00a9e0] text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <Button
                  onClick={() => handlePageChange(paginationMeta.currentPage + 1)}
                  disabled={!paginationMeta.hasNextPage}
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg h-10 px-3 flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

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
                Delete FAQ
              </h3>
              <p className="text-black leading-relaxed">
                Are you sure you want to delete this FAQ? This action cannot be undone and all associated data will be permanently removed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-red-300 focus:ring-offset-2 shadow-lg hover:shadow-xl order-1 sm:order-2"
              >
                Delete FAQ
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

export default FAQManagement;