"use client";
import React, { useEffect, useState } from 'react';
import { XCircle, AlertCircle, RefreshCw, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';

const PaymentFailurePage = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryPayment = async () => {
    setIsRetrying(true);
    
    try {
      // Get base URL from environment or use current origin
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      
      // Redirect back to subscription page to retry
      window.location.href = `${baseUrl}/subscription`;
    } catch (error) {
      console.error('Error redirecting to subscription:', error);
      setIsRetrying(false);
    }
  };

  const handleBackToHome = () => {
    // Get base URL from environment or use current origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    window.location.href = `${baseUrl}/dashboard`;
  };

  const commonReasons = [
    'Insufficient funds in your account',
    'Card expired or blocked',
    'Network connectivity issues',
    'Incorrect card details',
    'Bank security restrictions'
  ];

  const troubleshootingSteps = [
    'Check your card details and try again',
    'Ensure you have sufficient balance',
    'Try using a different payment method',
    'Contact your bank if the issue persists',
    'Reach out to our support team'
  ];

  useEffect(() => {
    localStorage.removeItem("activeStripeSession");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004a7c] to-[#00a9e0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Failure Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-20 h-20 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold font-['Montserrat',Helvetica] mb-2">
            Payment Failed
          </h1>
          <p className="text-red-100 font-['Montserrat',Helvetica]">
            We couldn&apos;t process your payment
          </p>
        </div>

        {/* Failure Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-2">
              Subscription Not Activated
            </h2>
            <p className="text-gray-600 font-['Montserrat',Helvetica] text-sm">
              Your payment could not be processed. Please try again or use a different payment method.
            </p>
          </div>

          {/* Common Reasons */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-3 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-[#00a9e0]" />
              Common Reasons
            </h3>
            <div className="bg-[#004a7c0d] rounded-lg p-4">
              <div className="space-y-2">
                {commonReasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 font-['Montserrat',Helvetica]">
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-3">
              What to try next
            </h3>
            <div className="space-y-2">
              {troubleshootingSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#00a9e0] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-700 font-['Montserrat',Helvetica]">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="w-full bg-[#00a9e0] hover:bg-[#0088b3] text-white py-3 rounded-lg font-medium font-['Montserrat',Helvetica] transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Try Again</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleBackToHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium font-['Montserrat',Helvetica] transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800 font-['Montserrat',Helvetica]">
                Need Help?
              </h4>
            </div>
            <p className="text-xs text-blue-700 font-['Montserrat',Helvetica]">
              If you continue to experience issues, please contact our support team at{' '}
              <a href="mailto:support@yourapp.com" className="underline hover:text-blue-900">
                support@yourapp.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;