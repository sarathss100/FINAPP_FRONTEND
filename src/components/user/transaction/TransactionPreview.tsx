import React from 'react';
import { Info } from 'lucide-react';
import { IParsedTransaction } from '@/types/ITransaction';

interface TransactionPreviewProps {
  transactions: IParsedTransaction[];
}

const TransactionPreview: React.FC<TransactionPreviewProps> = ({ transactions }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Transaction Preview</h3>
        <div className="text-sm text-gray-500">
          {transactions.length} transactions found
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium text-gray-600">
          <div className="col-span-2">Date</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Credit</div>
          <div className="col-span-2">Debit</div>
          <div className="col-span-1 text-right">Balance</div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {transactions.map((transaction) => (
            <div 
              key={transaction.transaction_id}
              className="grid grid-cols-12 p-3 text-sm border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-2 text-gray-600">
                {transaction.date ? (transaction.date instanceof Date ? transaction.date.toLocaleDateString() : transaction.date) : 'N/A'}
              </div>
              <div className="col-span-4 font-medium truncate">{transaction.description}</div>
              <div className="col-span-1 text-xs">
                {transaction.transaction_type === 'income' ? 'Income' : 
                 transaction.transaction_type === 'expense' ? 'Expense' : 'Unknown'}
              </div>
              <div className="col-span-2 text-green-600">
                {transaction.credit_amount ? `₹ ${transaction.credit_amount.toFixed(2)}` : ''}
              </div>
              <div className="col-span-2 text-red-600">
                {transaction.debit_amount ? `₹ ${transaction.debit_amount.toFixed(2)}` : ''}
              </div>
              <div className="col-span-1 text-right font-medium">
                {transaction.closing_balance !== null ? 
                  `₹ ${transaction.closing_balance.toFixed(2)}` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start">
        <Info size={20} className="text-blue-500 mr-2 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Verification Required</p>
          <p>Please verify that the transactions and account information are correct before syncing.</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionPreview;
