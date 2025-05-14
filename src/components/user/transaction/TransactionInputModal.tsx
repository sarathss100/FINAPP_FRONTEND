"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/Dialog';
import { 
  Calendar, IndianRupee, Tag, AlertCircle, CheckCircle,
  Copy, CreditCard, Landmark, Plus, Search
} from "lucide-react";
import Button from "@/components/base/Button";
import { Badge } from '@/components/base/Badge';
import { toast } from 'react-toastify';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES, ITransaction } from '@/types/ITransaction';
import { IAccount } from '@/types/IAccounts';

interface TransactionInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTransaction: (transactionData: ITransaction) => void;
  accounts?: Array<IAccount>;
  initialData?: ITransaction | null;
  isEditing?: boolean;
}

export const TransactionInputModal = ({ 
  isOpen, 
  onClose, 
  onSaveTransaction,
  accounts = [],
  initialData = null,
  isEditing = false
}: TransactionInputModalProps) => {
  const [formData, setFormData] = useState({
    transaction_type: initialData?.transaction_type || 'EXPENSE',
    type: initialData?.type || 'REGULAR',
    category: initialData?.category || 'MISCELLANEOUS',
    amount: initialData?.amount || '',
    currency: 'INR',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    status: initialData?.status || 'COMPLETED',
    account_id: initialData?.account_id || (accounts.length > 0 ? accounts[0]._id : ''),
    related_account_id: initialData?.related_account_id || '',
    linked_entities: initialData?.linked_entities || []
  });

  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTypes, setFilteredTypes] = useState<string[]>([...TRANSACTION_TYPES]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([...TRANSACTION_CATEGORIES]);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        transaction_type: initialData.transaction_type || 'EXPENSE',
        type: initialData.type || 'REGULAR',
        category: initialData.category || 'MISCELLANEOUS',
        amount: initialData.amount || '',
        currency: 'INR',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
        tags: initialData.tags || [],
        status: initialData.status || 'COMPLETED',
        account_id: initialData.account_id || (accounts.length > 0 ? accounts[0]._id : ''),
        related_account_id: initialData.related_account_id || '',
        linked_entities: initialData.linked_entities || []
      });
    } else if (isOpen && !initialData) {
      // Reset form for new transaction
      setFormData({
        transaction_type: 'EXPENSE',
        type: 'REGULAR',
        category: 'MISCELLANEOUS',
        amount: '',
        currency: 'INR',
        date: new Date().toISOString().split('T')[0],
        description: '',
        tags: [],
        status: 'COMPLETED',
        account_id: accounts.length > 0 ? accounts[0]._id : '',
        related_account_id: '',
        linked_entities: []
      });
    }
  }, [isOpen, initialData, accounts]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTypes(
        TRANSACTION_TYPES.filter((type: string) => 
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredCategories(
        TRANSACTION_CATEGORIES.filter((category: string) => 
          category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTypes([...TRANSACTION_TYPES]);
      setFilteredCategories([...TRANSACTION_CATEGORIES]);
    }
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const handleTypeSelect = (type: typeof TRANSACTION_TYPES[number]) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleCategorySelect = (category: typeof TRANSACTION_CATEGORIES[number]) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.amount || !formData.account_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Convert amount to number
    const processedData = {
      ...formData,
      amount: Number(formData.amount),
      user_id: initialData?.user_id || '',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: initialData?.updatedAt || new Date().toISOString()
    };
    
    onSaveTransaction(processedData as ITransaction);
    toast.success(`Transaction ${isEditing ? 'updated' : 'added'} successfully!`);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'PENDING':
        return <Calendar className="w-4 h-4 mr-1" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric'
  //   });
  //   };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <Badge 
                className={`rounded-full mb-3 ${getStatusColor(formData.status)} flex items-center w-fit px-2 py-1`}
                variant="outline"
              >
                {getStatusIcon(formData.status)}
                {formData.status}
              </Badge>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Transaction' : 'New Transaction'}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Transaction Type Toggle */}
          <div className="mb-6">
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-center text-sm font-medium transition-all ${
                  formData.transaction_type === 'INCOME'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'INCOME' }))}
              >
                Income
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-center text-sm font-medium transition-all ${
                  formData.transaction_type === 'EXPENSE'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'EXPENSE' }))}
              >
                Expense
              </button>
            </div>
          </div>
          
          {/* Main Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Transaction Details Section */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
                Transaction Details
              </h3>
              
              <div className="space-y-4">
                {/* Amount */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                {/* Description */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Transaction description"
                    rows={3}
                  />
                </div>
                
                {/* Date */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Status */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Categories and Accounts Section */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Categories & Accounts
              </h3>
              
              <div className="space-y-4">
                {/* Search Categories & Types */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Categories & Types
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Search categories, types..."
                    />
                  </div>
                </div>
                
                {/* Type */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type*
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      {filteredTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {filteredTypes.slice(0, 5).map((type) => (
                      <Badge
                        key={type}
                        className={`cursor-pointer ${
                          formData.type === type
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => handleTypeSelect(type as typeof TRANSACTION_TYPES[number])}
                      >
                        {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Category */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    {filteredCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {filteredCategories.slice(0, 5).map((category) => (
                      <Badge
                        key={category}
                        className={`cursor-pointer ${
                          formData.category === category
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => handleCategorySelect(category as typeof TRANSACTION_CATEGORIES[number])}
                      >
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Account */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Landmark className="h-4 w-4 text-gray-500" />
                    </div>
                    <select
                      name="account_id"
                      value={formData.account_id}
                      onChange={handleInputChange}
                      className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.account_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Related Account (for transfers) */}
                {formData.type === 'TRANSFER' && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transfer To Account
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Copy className="h-4 w-4 text-gray-500" />
                      </div>
                      <select
                        name="related_account_id"
                        value={formData.related_account_id}
                        onChange={handleInputChange}
                        className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select target account</option>
                        {accounts
                          .filter(account => account._id !== formData.account_id)
                          .map((account) => (
                            <option key={account._id} value={account._id}>
                              {account.account_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tags Section */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-blue-600" />
              Tags
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  className="bg-blue-50 text-blue-700 flex items-center gap-1 px-2 py-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-gray-500 text-sm italic">No tags added</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${
                formData.transaction_type === 'INCOME'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isEditing ? 'Update Transaction' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
