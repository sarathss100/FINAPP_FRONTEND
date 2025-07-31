"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, Crown, ArrowRight, Calendar, CreditCard, Shield } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    localStorage.removeItem("activeStripeSession");
  }, []);

  useEffect(() => {
    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      // Get base URL from environment or use current origin
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      window.location.href = `${baseUrl}/dashboard`;
    }, 5000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const handleContinue = () => {
    // Get base URL from environment or use current origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    window.location.href = `${baseUrl}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold font-['Montserrat',Helvetica] mb-2">
            Payment Successful!
          </h1>
          <p className="text-green-100 font-['Montserrat',Helvetica]">
            Welcome to Premium Financial Management
          </p>
        </div>

        {/* Success Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Crown className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-2">
              Premium Plan Activated
            </h2>
            <p className="text-gray-600 font-['Montserrat',Helvetica] text-sm">
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>
          </div>

          {/* Plan Details */}
          <div className="bg-[#004a7c0d] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#00a9e0]" />
                <span className="text-sm font-medium text-[#004a7c] font-['Montserrat',Helvetica]">
                  Premium Plan
                </span>
              </div>
              <span className="text-sm font-semibold text-[#004a7c] font-['Montserrat',Helvetica]">
                ₹199/month
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-[#00a9e0]" />
              <span className="text-sm text-gray-600 font-['Montserrat',Helvetica]">
                Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#00a9e0]" />
              <span className="text-sm text-gray-600 font-['Montserrat',Helvetica]">
                30-day money back guarantee
              </span>
            </div>
          </div>

          {/* Features Unlocked */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-3">
              Features Unlocked
            </h3>
            <div className="space-y-2">
              {[
                'Goal Setting & Tracking',
                'Advanced Analytics',
                'Comprehensive Reports',
                'Investment Tracking',
                'Priority Support'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 font-['Montserrat',Helvetica]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full bg-[#00a9e0] hover:bg-[#0088b3] text-white py-3 rounded-lg font-medium font-['Montserrat',Helvetica] transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 font-['Montserrat',Helvetica]">
                Redirecting automatically in{' '}
                <span className="inline-flex items-center justify-center w-6 h-6 bg-[#00a9e0] text-white rounded-full text-xs font-semibold">
                  {countdown}
                </span>
                {' '}second{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;