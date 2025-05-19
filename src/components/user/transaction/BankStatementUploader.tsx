import React, { useState, useRef } from 'react';
import { Upload, File, Check } from 'lucide-react';
import AccountForm from './AccountForm';
import TransactionPreview from './TransactionPreview';
import { addTransaction, extractStatementData } from '@/service/transactionService';
import { IParsedTransaction, ITransaction} from '@/types/ITransaction';
import { toast } from 'react-toastify';
import { addAccount } from '@/service/accountService';
import { IAccount } from '@/types/IAccounts';

interface BankStatementUploaderProps {
  onClose: () => void;
}

// Mock transaction type
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

const BankStatementUploader: React.FC<BankStatementUploaderProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({ name: '', number: '', id: '' });
  const [transactions, setTransactions] = useState<IParsedTransaction[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    const response = await extractStatementData(formData);
    if (response.success) {
      setTransactions(response.data.extractedStatementData);
      setIsLoading(false);
      setCurrentStep(2);
    } 
  };

  const handleAccountSubmit = async (data: { name: string; number: string }) => {
    try {
      const latestBalance = transactions[transactions.length - 1].closing_balance || 0;
      const formData: IAccount = {
        account_name: data.name,
        currency: 'INR',
        is_active: true,
        account_type: 'Bank',
        current_balance: latestBalance,
        institution: data.name,
        account_number: data.number,
        created_by: '',
      }

      const response = await addAccount(formData);
      if (response.success) {
        setAccount({ ...data, id: response.data.addedAccount._id || 'id' });
        setCurrentStep(3);
      }
    } catch (error) {
      toast.error((error as Error).message || `Failed to Create or Find Account`);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      // Transform the parsed transactions into the format required by the backend
      const transactionData: ITransaction[] = transactions.map((parsedTx: IParsedTransaction) => {
        return {
          account_id: account.id,
          transaction_type: parsedTx.transaction_type.toUpperCase() as 'INCOME' | 'EXPENSE',
          type: parsedTx.transaction_type.toUpperCase() as 'INCOME' | 'EXPENSE',
          category: 'MISCELLANEOUS',
          amount: parsedTx.amount,
          credit_amount: parsedTx.credit_amount,
          debit_amount: parsedTx.debit_amount,
          closing_balance: parsedTx.closing_balance,
          currency: 'INR', 
          date: parsedTx.date ? String(parsedTx.date) : new Date().toISOString(),
          description: parsedTx.description,
          status: 'COMPLETED', 
          tags: [], 
          linked_entities: []
        };
      });
      
      const response = await addTransaction(transactionData);
      if (response.success) {
        console.log(response.data.addedTransaction);
        setIsLoading(false);
        setCurrentStep(4);
        onClose();
      } 
    } catch (error) {
      toast.error((error as Error).message || `Failed to Create Transactions.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 relative">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto z-10 relative ${
                currentStep === step
                  ? 'bg-[#004a7c] text-white'
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step ? <Check size={16} /> : step}
            </div>
            
            <div className="text-xs text-center mt-2 font-medium">
              {step === 1 && 'Upload File'}
              {step === 2 && 'Account Info'}
              {step === 3 && 'Verify Data'}
              {step === 4 && 'Complete'}
            </div>
            
            {step < 4 && (
              <div 
                className={`absolute top-4 left-1/2 w-full h-0.5 ${
                  currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* File Upload */}
      {currentStep === 1 && (
        <div 
          className={`border-2 ${isDragging ? 'border-[#004a7c] bg-[#6c5ce7]/5' : 'border-dashed border-gray-300'} 
                      rounded-lg p-8 text-center transition-all duration-200 cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls, .xlsm"
            className="hidden"
          />
          
          <div className="mx-auto w-16 h-16 flex items-center justify-center text-[#004a7c] mb-4">
            <Upload size={32} />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Upload Bank Statement</h3>
          <p className="text-gray-500 mb-4">
            Drag & drop your file here, or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: CSV, XLSX, XLS, XLSM
          </p>
          
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-t-2 border-[#004a7c] rounded-full animate-spin"></div>
            </div>
          )}
          
          {fileName && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <File size={16} className="text-[#004a7c]" />
              <span>{fileName}</span>
            </div>
          )}
        </div>
      )}

      {/* Account Information */}
      {currentStep === 2 && (
        <AccountForm onSubmit={handleAccountSubmit} />
      )}

      {/* Transaction Preview */}
      {currentStep === 3 && (
        <>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Account Name</p>
                <p className="font-medium">{account.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium">{account.number}</p>
              </div>
            </div>
          </div>
          
          <TransactionPreview transactions={transactions} />
          
          <div className="flex justify-end mt-6 gap-4">
            <button 
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleSync}
              className="px-6 py-2 bg-[#004a7c] hover:bg-[#5649c0] text-white rounded-md transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="8 17 12 21 16 17"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
                  </svg>
                  <span>Sync Data</span>
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Completion */}
      {currentStep === 4 && (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 text-green-500 rounded-full mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-xl font-medium mb-2">Data Synchronized Successfully!</h3>
          <p className="text-gray-500">
            Your transaction data has been successfully sent to the backend
          </p>
        </div>
      )}
    </div>
  );
};

export default BankStatementUploader;
