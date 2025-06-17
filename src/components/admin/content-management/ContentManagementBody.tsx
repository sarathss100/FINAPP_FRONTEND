"use client";
import { Search, Plus, Edit, Trash, Eye, EyeOff, Save, X, SearchIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Input from '@/components/base/Input';
import useFaqStore from '@/stores/faqs/faqStore';
import { IFaq } from '@/types/IFaq';
import { toast } from 'react-toastify';
import { addFaq, removeFaq, togglePublish, updateFaq } from '@/service/adminService';

const FAQManagement = function () {
  const faqs = useFaqStore((state) => state.allFaqs);
  const fetchAllFaqs = useFaqStore((state) => state.fetchAllFaqs);

  const handleStore = useCallback(() => {
    fetchAllFaqs();
  }, [fetchAllFaqs]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isPublished: true
  });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

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
          toast.success(response.message || 'Faq Added Successfully');
          handleStore();
          setFormData({ question: '', answer: '', isPublished: true });
          setShowAddForm(false);
        }
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add Faq');
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
          toast.success(response.message || 'Faq Updated Successfully');
          handleStore();
          setFormData({ question: '', answer: '', isPublished: true });
          setEditingFaq(null);
        }
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to Update Faq');
    }
  };

  const handleDelete = async (id: string) => {
    try {
        const response = await removeFaq(id);

        if (response.success) {
          toast.success(response.message || 'Faq Remove Successfully');
          setDeleteConfirmationId(null);
          handleStore();
        }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to remove Faq');
    }
  };

  const togglePublished = async (id: string) => {
    try {
      const response = await togglePublish(id);

      if (response.success) {
        toast.success(response.message || 'Faq Updated Successfully');
        handleStore();
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to Toggle Faq');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', isPublished: true });
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
              {faqs.length} Total FAQs
            </Badge>
            <Badge className="bg-green-100 text-green-700 font-normal">
              {faqs.filter(faq => faq.isPublished).length} Published
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-700 font-normal">
              {faqs.filter(faq => !faq.isPublished).length} Draft
            </Badge>
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

        {/* FAQ List */}
        <div className="space-y-4 px-4">
          {faqs.map((faq) => (
            <Card
              key={faq._id}
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
                  <Search className="w-12 h-12 mx-auto mb-3" />
                </div>
              </CardContent>
            </Card>
          )}
          
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
