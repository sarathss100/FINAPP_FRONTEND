"use client";
import {
  CheckIcon,
  CrownIcon,
  ShieldIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import { toast } from 'react-toastify';
import { fetchSubscriptionStatus, initiatePayment } from "@/service/subscriptionService";

const checkSubscriptionStatus = async () => {
  try {
    const response = await fetchSubscriptionStatus();
  
    return response.data.subscription_status;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false; 
  }
};

const SubscriptionPlanBody = function () {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isLoadingSubscriptionStatus, setIsLoadingSubscriptionStatus] = useState(true);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  // Check subscription status and active session on component mount
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setIsLoadingSubscriptionStatus(true);
      try {
        const isActive = await checkSubscriptionStatus();
        setHasActiveSubscription(isActive);
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      } finally {
        setIsLoadingSubscriptionStatus(false);
      }
    };

    // Check for active session in localStorage
    const checkActiveSession = () => {
      if (typeof window !== 'undefined') {
        const activeSession = localStorage.getItem("activeStripeSession");
        setHasActiveSession(!!activeSession);
      }
    };

    fetchSubscriptionStatus();
    checkActiveSession();
  }, []);

  // Check if button should be disabled
  const isButtonDisabled = () => {
    return isProcessing || hasActiveSession || hasActiveSubscription || isLoadingSubscriptionStatus;
  };

  // Get button text based on state
  const getButtonText = () => {
    if (isLoadingSubscriptionStatus) {
      return 'Loading...';
    }
    if (hasActiveSubscription) {
      return 'Already Subscribed';
    }
    if (hasActiveSession) {
      return 'Payment in Progress';
    }
    if (isProcessing) {
      return 'Processing...';
    }
    return 'Subscribe & Continue';
  };

  const handleSubscribe = async () => {
    // Check if user already has active subscription
    if (hasActiveSubscription) {
      toast.info("You already have an active subscription.");
      return;
    }

    const existingSessionUrl = typeof window !== 'undefined' ? localStorage.getItem("activeStripeSession") : null;

    if (existingSessionUrl) {
      toast.info("You already have an active payment session.");
      window.location.href = existingSessionUrl;
      return;
    }

    setIsProcessing(true);

    try {
      const response = await initiatePayment({
        amount: 199,
        currency: 'INR',
        plan: 'monthly', 
      });

      const checkoutUrl = response.data.checkoutUrl;

      if (checkoutUrl) {
        // Store session URL in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("activeStripeSession", checkoutUrl);
          setHasActiveSession(true);
        }

        toast.success('Redirecting to payment gateway...');
        window.location.href = checkoutUrl;
      } else {
        toast.error('Failed to initiate payment session.');
      }

    } catch (error) {
      console.log((error as Error).message);
      toast.error('Something went wrong during payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    {
      icon: <TrendingUpIcon className="w-5 h-5 text-[#00a9e0]" />,
      title: "Goal Setting & Tracking",
      description: "Set financial goals and track your progress with detailed analytics"
    },
    {
      icon: <ShieldIcon className="w-5 h-5 text-[#00a9e0]" />,
      title: "Transaction Management",
      description: "Track all your income and expenses with smart categorization"
    },
    {
      icon: <UsersIcon className="w-5 h-5 text-[#00a9e0]" />,
      title: "Comprehensive Analysis",
      description: "Detailed inflow/outflow analysis with visual reports and insights"
    },
    {
      icon: <CheckIcon className="w-5 h-5 text-[#00a9e0]" />,
      title: "Debt & Investment Tracking",
      description: "Manage debts, insurances, investments, and future projections"
    }
  ];

  const benefits = [
    "Unlimited goal tracking",
    "Advanced transaction analytics",
    "Comprehensive financial reports",
    "Debt management tools",
    "Insurance policy tracking",
    "Investment portfolio analysis",
    "Future projection modeling",
    "Cash flow optimization",
    "Budget planning & monitoring",
    "Tax planning insights",
    "Mobile app access",
    "Priority customer support"
  ];

  return (
    <main className="container mx-auto p-8 max-w-7xl">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle 
        title="Subscription Plans" 
        tag="Choose the perfect plan for your complete financial management needs" 
      />

      {/* Main subscription card */}
      <section className="max-w-4xl mx-auto mb-8">
        <Card className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a] overflow-hidden">
          <CardContent className="p-0">
            {/* Header section with gradient */}
            <div className="bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white p-8 text-center">
              <div className="flex justify-center mb-4">
                <CrownIcon className="w-16 h-16 text-yellow-300" />
              </div>
              <h2 className="text-3xl font-bold font-['Montserrat',Helvetica] mb-2">
                Premium Financial Plan
              </h2>
              <p className="text-lg font-normal font-['Montserrat',Helvetica] opacity-90">
                Complete personal financial management solution
              </p>
              <Badge className="bg-yellow-400 text-yellow-900 font-normal font-['Montserrat',Helvetica] text-sm px-4 py-2 rounded-full mt-4">
                {hasActiveSubscription ? "Current Plan" : "Most Popular"}
              </Badge>
            </div>

            {/* Pricing section */}
            <div className="bg-white p-8 text-center border-b border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-[#004a7c] font-['Montserrat',Helvetica]">
                  ₹199
                </span>
                <span className="text-lg text-gray-600 font-normal font-['Montserrat',Helvetica] ml-2">
                  /month
                </span>
              </div>
              <p className="text-gray-600 font-normal font-['Montserrat',Helvetica] mb-6">
                Billed monthly • Cancel anytime
              </p>
              
              <Button
                onClick={handleSubscribe}
                disabled={isButtonDisabled()}
                className={`px-8 py-3 rounded-lg font-medium font-['Montserrat',Helvetica] text-lg transition-all duration-200 shadow-lg ${
                  isButtonDisabled()
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-[#00a9e0] hover:bg-[#0088b3] text-white hover:scale-[1.02] hover:shadow-xl'
                }`}
              >
                {getButtonText()}
              </Button>

              {/* Show subscription status message */}
              {hasActiveSubscription && (
                <p className="text-green-600 font-medium font-['Montserrat',Helvetica] mt-3 text-sm">
                  ✓ You have an active subscription
                </p>
              )}
              
              {hasActiveSession && !hasActiveSubscription && (
                <p className="text-orange-600 font-medium font-['Montserrat',Helvetica] mt-3 text-sm">
                  ⏳ Payment session in progress
                </p>
              )}
            </div>

            {/* Features section */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-6 text-center">
                What&apos;s Included
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#00a9e01a] rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits list */}
              <div className="bg-[#004a7c0d] rounded-lg p-6">
                <h4 className="font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-4">
                  Complete Financial Management Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-[#00a9e0] flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-normal font-['Montserrat',Helvetica]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Additional info cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-[#00a9e01a] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="w-6 h-6 text-[#00a9e0]" />
            </div>
            <h3 className="font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-2">
              Secure & Private
            </h3>
            <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
              Bank-level security with 256-bit SSL encryption for your financial data
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-[#00a9e01a] rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-6 h-6 text-[#00a9e0]" />
            </div>
            <h3 className="font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-2">
              24/7 Support
            </h3>
            <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
              Get help with financial planning from our expert team
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a]">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-[#00a9e01a] rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUpIcon className="w-6 h-6 text-[#00a9e0]" />
            </div>
            <h3 className="font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-2">
              Smart Insights
            </h3>
            <p className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
              AI-powered financial insights and personalized recommendations
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ or guarantee section */}
      <section className="max-w-4xl mx-auto">
        <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d]">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-[#004a7c] font-['Montserrat',Helvetica] mb-4">
              30-Day Money Back Guarantee
            </h3>
            <p className="text-gray-600 font-normal font-['Montserrat',Helvetica] mb-6">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
                  Cancel anytime
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
                  No hidden fees
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 font-normal font-['Montserrat',Helvetica]">
                  Instant activation
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default SubscriptionPlanBody;