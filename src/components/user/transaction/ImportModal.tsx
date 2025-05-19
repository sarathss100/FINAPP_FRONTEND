import React, { useEffect, useRef, useState } from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const ImportModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Upload Transaction Statement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="border-b">
          <div className="flex">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'upload' ? 'text-[#004a7c] border-b-2 border-[#004a7c]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload File
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'help' ? 'text-[#004a7c] border-b-2 border-[#004a7c]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('help')}
            >
              How It Works
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {activeTab === 'upload' ? (
            children
          ) : (
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold mb-6">How to Import transactions</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-[#004a7c]">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Download Your Bank Statement</h4>
                    <p className="text-gray-600">Log into your online banking portal and download your statement as a CSV or Excel file. Most banks offer this option in the account activity or statements section.</p>
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        Make sure to download the complete transaction history for the period you want to analyze
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-[#004a7c]">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Upload Your Statement</h4>
                    <p className="text-gray-600">Click the &quot;Select File&quot; button or drag and drop your downloaded bank statement file into the upload area. Our system accepts CSV and Excel formats (.xlsx, .xls).</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-[#004a7c]">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Review Extracted Transactions</h4>
                    <p className="text-gray-600">Our system automatically detects and extracts transaction data, identifies dates, amounts, and descriptions. Smart categorization will be applied to classify your spending.</p>
                    <div className="mt-3 flex gap-3">
                      <div className="p-2 border rounded-md flex items-center">
                        <FileText size={16} className="mr-2 text-[#004a7c]" />
                        <span className="text-sm">Automatic date formatting</span>
                      </div>
                      <div className="p-2 border rounded-md flex items-center">
                        <FileText size={16} className="mr-2 text-[#004a7c]" />
                        <span className="text-sm">Smart categorization</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-[#004a7c]">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Export or Continue Analysis</h4>
                    <p className="text-gray-600">After processing, you can export the structured data as CSV or JSON format, or continue with our built-in analysis tools to visualize your spending patterns.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium mb-2 text-[#004a7c]">Need Help?</h4>
                <p className="text-sm text-[#004a7c]">If you&apos;re having trouble with your bank&apos;s statement format or need assistance with the extraction process, please check our FAQ section or contact support.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
