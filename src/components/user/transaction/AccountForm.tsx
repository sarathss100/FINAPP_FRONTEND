import React, { useState } from 'react';

interface AccountFormProps {
  onSubmit: (data: { name: string; number: string }) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [errors, setErrors] = useState({ name: '', number: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {
      name: accountName.trim() === '' ? 'Account name is required' : '',
      number: accountNumber.trim() === '' ? 'Account number is required' : ''
    };
    
    setErrors(newErrors);
    
    if (newErrors.name === '' && newErrors.number === '') {
      onSubmit({ name: accountName, number: accountNumber });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">Enter Account Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Name
          </label>
          <input
            type="text"
            id="accountName"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#004a7c] transition-colors`}
            placeholder="e.g. Personal Checking"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#004a7c] transition-colors`}
            placeholder="e.g. XXXX-XXXX-XXXX-1234"
          />
          {errors.number && <p className="mt-1 text-sm text-red-500">{errors.number}</p>}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#004a7c] hover:bg-[#3b3fc8] text-white py-2 px-4 rounded-md transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
