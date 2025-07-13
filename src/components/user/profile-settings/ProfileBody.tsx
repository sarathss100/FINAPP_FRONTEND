/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { LockIcon, ShieldIcon, UserIcon, DownloadIcon, TrashIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '../../base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../base/Card';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores/store';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import auth from '@/lib/firebaseConfig';
import { deleteAccount, getUserProfileDetails, toggleUserTwoFactorAuthentication } from '@/service/userService';
import UserHeader from '../base/Header';
import PageTitle from '../base/PageTitle';
import Input from '@/components/base/Input';
import RecaptchaComponent from '@/components/base/auth/RecaptchaComponent';
import PhoneNumberVerificationModal from '@/components/base/auth/forgetpassword/PhoneNumberVerificationModal';
import ResetPasswordOtpVerificationModal from '@/components/base/auth/forgetpassword/ResetPasswordOtpVerificationModal';
import ResetPasswordModal from '@/components/base/auth/forgetpassword/ResetPasswordModal';
import { Switch } from '@/components/base/switch';
import { signout } from '@/service/authenticationService';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ProfilePicture from '@/components/base/ProfilePicture';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import useInvestmentStore from "@/stores/investment/investmentStore";
import useDebtStore from "@/stores/debt/debtStore";
import { useInsuranceStore } from "@/stores/insurances/insuranceStore";
import { useGoalStore } from "@/stores/goals/goalStore";

interface AutoTableOptions {
  startY?: number;
  head?: (string | number)[][];
  body: (string | number)[][];
  theme?: string;
  headStyles?: Record<string, unknown>;
  bodyStyles?: Record<string, unknown>;
  alternateRowStyles?: Record<string, unknown>;
  margin?: { left: number; right: number };
  tableWidth?: string;
  columnStyles?: Record<string, Record<string, unknown>>;
}

interface AutoTableOutput {
  finalY: number;
  pageCount: number;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => AutoTableOutput;
    lastAutoTable: AutoTableOutput;
  }
}

export const ProfileBody = function () {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPhoneNumberVerificationModalOpen, setIsPhoneNumberVerificationModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isPhoneNumberLoading, setIsPhoneNumberLoading] = useState(false);
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const goals = useGoalStore((state) => state.goals);
  const investments = useInvestmentStore((state) => state.investments);
  const debts = useDebtStore((state) => state.allDebts);
  const insurance = useInsuranceStore((state) => state.allInsurances);
  const fetchAllGoals = useGoalStore((state) => state.fetchAllGoals);
  const fetchInvestments = useInvestmentStore((state) => state.fetchInvestments);
  const fetchDebts = useDebtStore((state) => state.fetchAllDebts);
  const fetchInsurances = useInsuranceStore((state) => state.fetchAllInsurances);

  const handleStore = useCallback(function() {
    fetchAllGoals();
    fetchInvestments();
    fetchDebts();
    fetchInsurances();
  }, [fetchAllGoals, fetchInvestments, fetchDebts, fetchInsurances]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  // Access Zustand store's state and actions
  const { user, login, logout } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user data already exists in Zustand
      if (user) {
        setLoading(false); // No need to fetch, data already exists
        return;
      }

      setLoading(true);
      try {
        const response = await getUserProfileDetails();
        if (response.success) {
          const userData = response.data;

          // Update the 2FA state
          setIsTwoFactorEnabled(userData.is2FA);

          // Update Zustand store with user data
          login(userData);
        } else {
          setError(response.message || `Failed to fetch user data`);
        }
      } catch (error) {
        setError((error as Error).message || `An occured while fetchnig user data`)
      } finally {
        setLoading(false);
      }
    };
   fetchUserData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrap onRecaptchaInit in useCallback
  const handleRecaptchaInit = useCallback((verifier: RecaptchaVerifier) => {
    setRecaptchaVerifier(verifier);
  }, []);

  const handlePhoneVerificationSuccess = async (phone: string) => {
    setIsPhoneNumberLoading(true);
    try {
      setPhoneNumber(phone); // Store the verified phone number
      if (!recaptchaVerifier) {
          throw new Error(`reCAPTCHA  verifier not initialized`);
      }
      // Send OTP to the provided phone number 
      const result = await signInWithPhoneNumber(auth, `+91 ${phone}`, recaptchaVerifier);
      setConfirmationResult(result);

      setIsPhoneNumberVerificationModalOpen(false); // Close the phone verification modal
      setIsOtpModalOpen(true); // Open the OTP confirmation modal
    } catch (error) {
      console.error("Error sending OTP:", error);
      handleFailure((error as Error).message || "Failed to send OTP");
    } finally {
      setIsPhoneNumberLoading(false);
    }
  };

  const handleOTPVerificationSuccess = () => {
    setIsOTPLoading(true); 
    try {
      setIsOtpModalOpen(false) // Close the OTP confirmation modal
      setIsResetPasswordModalOpen(true);
    } catch (error) {
      console.error("Fail to verify OTP:", error);
      handleFailure((error as Error).message || "Failed to verify OTP");
    } finally {
      setIsOTPLoading(false);
    }
  }

  const handleResetPasswordSuccess = (message: string) => {
    setIsResetPasswordLoading(true);
    try {
      toast.success(message);
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error("Fail to Reset the Password:", error);
      handleFailure((error as Error).message || "Failed to Reset the Password");
    } finally {
      setIsResetPasswordLoading(false);
    }
  }

  const handleFailure = (message: string) => {
    setIsPhoneNumberVerificationModalOpen(false);
    setIsOtpModalOpen(false);
    setIsResetPasswordModalOpen(false);
    toast.error(message || `Failed to Verify the Phone Number, Please try again Late`);
  }

  const handleToggle2FA = async function () {
    try {
      const data = await toggleUserTwoFactorAuthentication();
      setIsTwoFactorEnabled(data.data.isToggled);
      toast.success(data.message);
    } catch (error) {
      toast.error((error as Error).message || `Failed to toggle 2FA`);
    }
  }

  // Function to handle sign out
  const handleSignOut = async function () {
    // Send logout request to backend 
    await signout();

    // Reset Zustand state
    logout();

    // Redirect to login page
    window.location.replace('/login');
  }

  const handleGenerateReport = async function(reportOptions = {}) {
    // Default report configuration
    const defaultOptions = {
      includeGoals: true,
      includeDebts: true,
      includeInsurance: true,
      reportTitle: 'Financial Report',
      reportSubtitle: 'Professional Financial Analysis'
    };
    
    const options = { ...defaultOptions, ...reportOptions };
    
    // Data validation
    const availableData = {
      goals: goals && Object.keys(goals).length > 0 ? Object.values(goals) : [],
      debts: debts && Object.keys(debts).length > 0 ? Object.values(debts) : [],
      insurance: insurance && Object.keys(insurance).length > 0 ? Object.values(insurance) : []
    };
    
    // Check if any data is available
    const hasData = (
      (options.includeGoals && availableData.goals.length > 0) ||
      (options.includeDebts && availableData.debts.length > 0) ||
      (options.includeInsurance && availableData.insurance.length > 0)
    );
    
    if (!hasData) {
      toast.error('No data available for the selected report categories');
      return;
    }

    setIsGeneratingReport(true);
    
    try {
      // Initialize PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Document properties
      doc.setProperties({
        title: options.reportTitle,
        subject: 'Personal Finance Report',
        author: `${user?.firstName} ${user?.lastName}`,
        creator: 'Financial Tracker App'
      });

      // Layout constants
      const layout = {
        margin: 20,
        pageWidth: doc.internal.pageSize.width,
        pageHeight: doc.internal.pageSize.height,
        lineHeight: 6,
        sectionSpacing: 15,
        itemSpacing: 10
      };

      let yPosition = layout.margin;
      
      // Page management
      interface CheckNewPageParams {
        requiredHeight: number;
      }

      interface CheckNewPageResult {
        addedNewPage: boolean;
      }

      const checkNewPage = (requiredHeight: number): CheckNewPageResult => {
        if (yPosition + requiredHeight > layout.pageHeight - 30) {
          doc.addPage();
          yPosition = layout.margin;
          return { addedNewPage: true };
        }
        return { addedNewPage: false };
      };

      // Text rendering utilities
      interface TextRenderOptions {
        fontSize?: number;
        weight?: string;
      }

      const renderText = (text: string, x: number, y: number, options: TextRenderOptions = {}): void => {
        doc.setFontSize(options.fontSize || 10);
        doc.setFont('helvetica', options.weight || 'normal'); 
        doc.text(text, x, y);
      };

      interface RenderLineParams {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        width?: number;
      }

      const renderLine = ({ x1, y1, x2, y2, width = 0.5 }: RenderLineParams): void => {
        doc.setLineWidth(width);
        doc.line(x1, y1, x2, y2);
      };

      interface RenderBoxParams {
        x: number;
        y: number;
        width: number;
        height: number;
        fill?: boolean;
      }

      const renderBox = ({ x, y, width, height, fill = false }: RenderBoxParams): void => {
        doc.setLineWidth(0.5);
        if (fill) {
          doc.setFillColor(245, 245, 245);
          doc.rect(x, y, width, height, 'FD');
        } else {
          doc.rect(x, y, width, height);
        }
      };

      // Header
      const renderHeader = () => {
        // Title
        renderText(options.reportTitle, layout.margin, yPosition, {
          fontSize: 22,
          weight: 'bold'
        });
        yPosition += 10;
        
        // Subtitle
        renderText(options.reportSubtitle, layout.margin, yPosition, {
          fontSize: 12
        });
        yPosition += 8;
        
        // Header line
        renderLine({
          x1: layout.margin,
          y1: yPosition,
          x2: layout.pageWidth - layout.margin,
          y2: yPosition,
          width: 1
        });
        yPosition += 12;
        
        // User info section
        renderText('REPORT DETAILS', layout.margin, yPosition, {
          fontSize: 12,
          weight: 'bold'
        });
        yPosition += 8;
        
        // User information
        renderText(`Name: ${user?.firstName} ${user?.lastName}`, layout.margin, yPosition);
        yPosition += 6;
        
        renderText(`Phone: ${user?.phoneNumber}`, layout.margin, yPosition);
        yPosition += 6;
        
        renderText(`Generated: ${new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`, layout.margin, yPosition);
        yPosition += layout.sectionSpacing;
      };

      // Executive Summary
      const renderExecutiveSummary = () => {
        checkNewPage(50);
        
        renderText('EXECUTIVE SUMMARY', layout.margin, yPosition, {
          fontSize: 14,
          weight: 'bold'
        });
        yPosition += 10;
        
        renderLine({
          x1: layout.margin,
          y1: yPosition,
          x2: layout.pageWidth - layout.margin,
          y2: yPosition
        });
        yPosition += 10;
        
        const stats = calculateStatistics();
        
        // Summary table
        const tableData = [];
        
        if (options.includeGoals && stats.goals.total > 0) {
          tableData.push(['GOALS OVERVIEW', '']);
          tableData.push(['Total Goals', stats.goals.total.toString()]);
          tableData.push(['Completed Goals', stats.goals.completed.toString()]);
          tableData.push(['Total Target Amount', `₹${stats.goals.totalTarget.toLocaleString()}`]);
          tableData.push(['Current Amount Saved', `₹${stats.goals.totalCurrent.toLocaleString()}`]);
          tableData.push(['Overall Progress', `${((stats.goals.totalCurrent / stats.goals.totalTarget) * 100).toFixed(1)}%`]);
          tableData.push(['', '']);
        }
        
        if (options.includeDebts && stats.debts.total > 0) {
          tableData.push(['DEBT OVERVIEW', '']);
          tableData.push(['Total Debts', stats.debts.total.toString()]);
          tableData.push(['Total Original Debt', `₹${stats.debts.totalDebt.toLocaleString()}`]);
          tableData.push(['Amount Paid Off', `₹${stats.debts.totalPaid.toLocaleString()}`]);
          tableData.push(['Remaining Balance', `₹${stats.debts.totalRemaining.toLocaleString()}`]);
          tableData.push(['Debt Payoff Progress', `${((stats.debts.totalPaid / stats.debts.totalDebt) * 100).toFixed(1)}%`]);
          tableData.push(['', '']);
        }
        
        if (options.includeInsurance && stats.insurance.total > 0) {
          tableData.push(['INSURANCE OVERVIEW', '']);
          tableData.push(['Total Policies', stats.insurance.total.toString()]);
          tableData.push(['Active Policies', stats.insurance.activePolicies.toString()]);
          tableData.push(['Total Coverage', `₹${stats.insurance.totalCoverage.toLocaleString()}`]);
          tableData.push(['Annual Premium', `₹${stats.insurance.totalPremium.toLocaleString()}`]);
          tableData.push(['', '']);
        }
        
        // Net Worth calculation
        const netWorth = stats.goals.totalCurrent - stats.debts.totalRemaining;
        tableData.push(['FINANCIAL POSITION', '']);
        tableData.push(['Total Assets', `₹${stats.goals.totalCurrent.toLocaleString()}`]);
        tableData.push(['Total Liabilities', `₹${stats.debts.totalRemaining.toLocaleString()}`]);
        tableData.push(['Net Worth', `₹${netWorth.toLocaleString()}`]);
        
        // Render summary table
        tableData.forEach((row, index) => {
          const isHeader = row[0].includes('OVERVIEW') || row[0] === 'FINANCIAL POSITION';
          const isEmpty = row[0] === '' && row[1] === '';
          
          if (isEmpty) {
            yPosition += 5;
            return;
          }
          
          if (isHeader) {
            renderBox({
              x: layout.margin,
              y: yPosition - 3,
              width: layout.pageWidth - 2 * layout.margin,
              height: 8,
              fill: true
            });
            renderText(row[0], layout.margin + 3, yPosition + 2, {
              fontSize: 11,
              weight: 'bold'
            });
            yPosition += 10;
          } else {
            renderText(row[0], layout.margin + 5, yPosition);
            renderText(row[1], layout.margin + 100, yPosition, {
              weight: 'bold'
            });
            yPosition += 6;
          }
        });
        
        yPosition += layout.sectionSpacing;
      };

      // Calculate statistics
      const calculateStatistics = () => {
        const stats = {
          goals: {
            total: availableData.goals.length,
            completed: availableData.goals.filter(g => g.is_completed).length,
            totalTarget: availableData.goals.reduce((sum, g) => sum + g.target_amount, 0),
            totalCurrent: availableData.goals.reduce((sum, g) => sum + g.current_amount, 0)
          },
          debts: {
            total: availableData.debts.length,
            totalDebt: availableData.debts.reduce((sum, d) => sum + (d.initialAmount || 0), 0),
            totalPaid: availableData.debts.reduce((sum, d) => sum + ((d.initialAmount - (d.currentBalance || 0)) || 0), 0),
            totalRemaining: availableData.debts.reduce((sum, d) => sum + (d.currentBalance || 0), 0)
          },
          insurance: {
            total: availableData.insurance.length,
            totalCoverage: availableData.insurance.reduce((sum, i) => sum + (i.coverage || 0), 0),
            totalPremium: availableData.insurance.reduce((sum, i) => sum + (i.premium || 0), 0),
            activePolicies: availableData.insurance.filter(i => i.status === 'active').length
          }
        };
        
        return stats;
      };

      // Goals section
      const renderGoalsSection = () => {
        if (!options.includeGoals || availableData.goals.length === 0) return;
        
        checkNewPage(40);
        
        renderText('FINANCIAL GOALS ANALYSIS', layout.margin, yPosition, {
          fontSize: 14,
          weight: 'bold'
        });
        yPosition += 10;
        
        renderLine({
          x1: layout.margin,
          y1: yPosition,
          x2: layout.pageWidth - layout.margin,
          y2: yPosition
        });
        yPosition += 12;
        
        availableData.goals.forEach((goal, index) => {
          checkNewPage(35);
          
          // Goal header
          renderText(`Goal ${index + 1}: ${goal.goal_name}`, layout.margin, yPosition, {
            fontSize: 12,
            weight: 'bold'
          });
          yPosition += 8;
          
          // Goal details table
          const goalProgress = goal.target_amount > 0 ? ((goal.current_amount / goal.target_amount) * 100) : 0;
          const remaining = goal.target_amount - goal.current_amount;
          const targetDate = new Date(goal.target_date);
          const daysRemaining = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          const goalData = [
            ['Target Amount:', `₹${goal.target_amount.toLocaleString()}`],
            ['Current Amount:', `₹${goal.current_amount.toLocaleString()}`],
            ['Remaining Amount:', `₹${remaining.toLocaleString()}`],
            ['Progress:', `${goalProgress.toFixed(1)}%`],
            ['Target Date:', targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ['Days Remaining:', daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'],
            ['Status:', goal.is_completed ? 'COMPLETED' : 'IN PROGRESS']
          ];
          
          // Create goal info box
          renderBox({
            x: layout.margin,
            y: yPosition,
            width: layout.pageWidth - 2 * layout.margin,
            height: goalData.length * 6 + 4
          });
          yPosition += 4;
          
          goalData.forEach(row => {
            renderText(row[0], layout.margin + 5, yPosition, { fontSize: 10 });
            renderText(row[1], layout.margin + 80, yPosition, { fontSize: 10, weight: 'bold' });
            yPosition += 6;
          });
          
          yPosition += 10;
          
          // Progress bar representation
          renderText('Progress Visualization:', layout.margin, yPosition, { fontSize: 10 });
          yPosition += 6;
          
          const barWidth = 100;
          const progressWidth = (goalProgress / 100) * barWidth;
          
          // Progress bar outline
          renderBox({
            x: layout.margin,
            y: yPosition,
            width: barWidth,
            height: 5
          });
          
          // Progress bar fill (using pattern for B&W)
          if (progressWidth > 0) {
            doc.setFillColor(0, 0, 0);
            doc.rect(layout.margin, yPosition, progressWidth, 5, 'F');
          }
          
          renderText(`${goalProgress.toFixed(1)}%`, layout.margin + barWidth + 5, yPosition + 3, {
            fontSize: 9,
            weight: 'bold'
          });
          
          yPosition += 15;
        });
        
        yPosition += layout.sectionSpacing;
      };

      // Debts section
      const renderDebtsSection = () => {
        if (!options.includeDebts || availableData.debts.length === 0) return;
        
        checkNewPage(40);
        
        renderText('DEBT MANAGEMENT ANALYSIS', layout.margin, yPosition, {
          fontSize: 14,
          weight: 'bold'
        });
        yPosition += 10;
        
        renderLine({
          x1: layout.margin,
          y1: yPosition,
          x2: layout.pageWidth - layout.margin,
          y2: yPosition
        });
        yPosition += 12;
        
        availableData.debts.forEach((debt, index) => {
          checkNewPage(50);
          
          // Debt header
          renderText(`Debt ${index + 1}: ${debt.debtName}`, layout.margin, yPosition, {
            fontSize: 12,
            weight: 'bold'
          });
          yPosition += 8;
          
          // Debt details
          const debtProgress = debt.initialAmount > 0 ? (((debt.initialAmount - (debt.currentBalance || 0)) / debt.initialAmount) * 100) : 0;
          const totalInterest = (debt.currentBalance || 0) * (debt.interestRate / 100);
          const monthsRemaining = (debt.monthlyPayment ?? 0) > 0 ? Math.ceil((debt.currentBalance || 0) / (debt.monthlyPayment ?? 0)) : 0;
          
          const debtData = [
            ['Debt Type:', debt.debtName || 'Not specified'],
            ['Initial Amount:', `₹${debt.initialAmount.toLocaleString()}`],
            ['Current Balance:', `₹${(debt.currentBalance || 0).toLocaleString()}`],
            ['Amount Paid:', `₹${(debt.initialAmount - (debt.currentBalance || 0)).toLocaleString()}`],
            ['Interest Rate:', `${debt.interestRate}% ${debt.interestType || 'per annum'}`],
            ['Monthly Payment:', `₹${(debt.monthlyPayment || 0).toLocaleString()}`],
            ['Payoff Progress:', `${debtProgress.toFixed(1)}%`],
            ['Estimated Months to Payoff:', monthsRemaining > 0 ? `${monthsRemaining} months` : 'N/A'],
            ['Next Due Date:', debt.nextDueDate ? new Date(debt.nextDueDate).toLocaleDateString() : 'Not set'],
            ['Status:', debt.status || 'Active'],
            ['Debt Classification:', debt.isGoodDebt ? 'Good Debt' : 'Bad Debt']
          ];
          
          // Create debt info box
          renderBox({
            x: layout.margin,
            y: yPosition,
            width: layout.pageWidth - 2 * layout.margin,
            height: debtData.length * 6 + 4
          });
          yPosition += 4;
          
          debtData.forEach(row => {
            renderText(row[0], layout.margin + 5, yPosition, { fontSize: 10 });
            renderText(row[1], layout.margin + 80, yPosition, { fontSize: 10, weight: 'bold' });
            yPosition += 6;
          });
          
          yPosition += 10;
          
          // Payoff progress bar
          renderText('Payoff Progress:', layout.margin, yPosition, { fontSize: 10 });
          yPosition += 6;
          
          const barWidth = 100;
          const progressWidth = (debtProgress / 100) * barWidth;
          
          renderBox({
            x: layout.margin,
            y: yPosition,
            width: barWidth,
            height: 5
          });
          
          if (progressWidth > 0) {
            doc.setFillColor(0, 0, 0);
            doc.rect(layout.margin, yPosition, progressWidth, 5, 'F');
          }
          
          renderText(`${debtProgress.toFixed(1)}% Paid Off`, layout.margin + barWidth + 5, yPosition + 3, {
            fontSize: 9,
            weight: 'bold'
          });
          
          yPosition += 15;
          
          // Debt strategy recommendations
          if (debt.isGoodDebt === false) {
            renderText('Recommendation: Prioritize paying off this bad debt to reduce interest burden.', 
                      layout.margin, yPosition, { fontSize: 9 });
            yPosition += 6;
          }
          
          yPosition += 10;
        });
        
        yPosition += layout.sectionSpacing;
      };

      // Insurance section
      const renderInsuranceSection = () => {
        if (!options.includeInsurance || availableData.insurance.length === 0) return;
        
        checkNewPage(40);
        
        renderText('INSURANCE COVERAGE ANALYSIS', layout.margin, yPosition, {
          fontSize: 14,
          weight: 'bold'
        });
        yPosition += 10;
        
        renderLine({
          x1: layout.margin,
          y1: yPosition,
          x2: layout.pageWidth - layout.margin,
          y2: yPosition
        });
        yPosition += 12;
        
        availableData.insurance.forEach((policy, index) => {
          checkNewPage(40);
          
          // Policy header
          renderText(`Policy ${index + 1}: ${policy.type || 'Insurance Policy'}`, layout.margin, yPosition, {
            fontSize: 12,
            weight: 'bold'
          });
          yPosition += 8;
          
          // Policy details
          const policyData = [
            ['Policy Type:', policy.type || 'Not specified'],
            ['Policy Number:', policy._id || 'Not provided'],
            ['Coverage Amount:', `₹${(policy.coverage || 0).toLocaleString()}`],
            ['Premium Amount:', `₹${(policy.premium || 0).toLocaleString()}`],
            ['Status:', policy.status || 'Unknown'],
            ['Next Premium Due:', policy.next_payment_date ? new Date(policy.next_payment_date).toLocaleDateString() : 'Not set']
          ];
          
          // Create policy info box
          renderBox({
            x: layout.margin,
            y: yPosition,
            width: layout.pageWidth - 2 * layout.margin,
            height: policyData.length * 6 + 4
          });
          yPosition += 4;
          
          policyData.forEach(row => {
            renderText(row[0], layout.margin + 5, yPosition, { fontSize: 10 });
            renderText(row[1], layout.margin + 80, yPosition, { fontSize: 10, weight: 'bold' });
            yPosition += 6;
          });
          
          yPosition += 10;
          
          // Coverage adequacy assessment
          if (policy.coverage > 0) {
            renderText('Coverage Assessment:', layout.margin, yPosition, { fontSize: 10, weight: 'bold' });
            yPosition += 6;
            
            let assessment = '';
            if (policy.coverage >= 1000000) {
              assessment = 'Excellent coverage amount for comprehensive protection.';
            } else if (policy.coverage >= 500000) {
              assessment = 'Good coverage amount for moderate protection.';
            } else {
              assessment = 'Consider increasing coverage for better protection.';
            }
            
            renderText(assessment, layout.margin, yPosition, { fontSize: 9 });
            yPosition += 6;
          }
          
          yPosition += 10;
        });
        
        yPosition += layout.sectionSpacing;
      };

      // Recommendations section
      const renderRecommendations = () => {
        checkNewPage(50);
        
        renderText('FINANCIAL RECOMMENDATIONS', layout.margin, yPosition, {
          fontSize: 14,
          weight: 'bold'
        });
        yPosition += 10;
        
        renderLine({
          x1: layout.margin,
          y1: yPosition,
          x2: layout.pageWidth - layout.margin,
          y2: yPosition
        });
        yPosition += 12;
        
        const recommendations = [];
        
        // Goal-based recommendations
        if (options.includeGoals && availableData.goals.length > 0) {
          const stats = calculateStatistics();
          const overallProgress = (stats.goals.totalCurrent / stats.goals.totalTarget) * 100;
          
          if (overallProgress < 25) {
            recommendations.push('Consider increasing your monthly savings to accelerate goal achievement.');
          } else if (overallProgress < 75) {
            recommendations.push('You are making good progress on your goals. Maintain consistency.');
          } else {
            recommendations.push('Excellent progress on goals! Consider setting new financial targets.');
          }
        }
        
        // Debt-based recommendations
        if (options.includeDebts && availableData.debts.length > 0) {
          const badDebts = availableData.debts.filter(d => d.isGoodDebt === false);
          if (badDebts.length > 0) {
            recommendations.push('Focus on paying off bad debts first to reduce interest burden.');
          }
          
          const highInterestDebts = availableData.debts.filter(d => d.interestRate > 15);
          if (highInterestDebts.length > 0) {
            recommendations.push('Prioritize high-interest debts for faster financial recovery.');
          }
        }
        
        // Insurance-based recommendations
        if (options.includeInsurance && availableData.insurance.length > 0) {
          const expiringSoon = availableData.insurance.filter(i => {
            if (!i.next_payment_date) return false;
            const endDate = new Date(i.next_payment_date);
            const today = new Date();
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 90 && diffDays > 0;
          });
          
          if (expiringSoon.length > 0) {
            recommendations.push('Review and renew insurance policies expiring within 90 days.');
          }
        }
        
        // General recommendations
        recommendations.push('Review and update your financial plan quarterly.');
        recommendations.push('Maintain an emergency fund of 6-12 months of expenses.');
        recommendations.push('Consider diversifying your financial portfolio.');
        
        // Render recommendations
        recommendations.forEach((rec, index) => {
          checkNewPage(8);
          renderText(`${index + 1}. ${rec}`, layout.margin, yPosition, { fontSize: 10 });
          yPosition += 8;
        });
        
        yPosition += layout.sectionSpacing;
      };

      // Footer
      const addFooter = () => {
        const pageCount = doc.internal.pages.length - 1;
        
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          
          // Footer line
          renderLine({
            x1: layout.margin,
            y1: layout.pageHeight - 20,
            x2: layout.pageWidth - layout.margin,
            y2: layout.pageHeight - 20
          });
          
          // Footer text
          renderText(`Page ${i} of ${pageCount}`, layout.pageWidth - 40, layout.pageHeight - 12, {
            fontSize: 8
          });
          
          renderText('Financial Tracker App - Confidential Report', layout.margin, layout.pageHeight - 12, {
            fontSize: 8
          });
        }
      };

      // Generate report
      renderHeader();
      renderExecutiveSummary();
      renderGoalsSection();
      renderDebtsSection();
      renderInsuranceSection();
      renderRecommendations();
      addFooter();

      // Save PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const includedCategories = [];
      if (options.includeGoals) includedCategories.push('goals');
      if (options.includeDebts) includedCategories.push('debts');
      if (options.includeInsurance) includedCategories.push('insurance');
      
      const fileName = `financial-report-${includedCategories.join('-')}-${timestamp}.pdf`;
      doc.save(fileName);
      
      toast.success('Professional financial report generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast.error('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleAccountDeletion = async function () {
    try {
      const data = await deleteAccount();
      if (data.data.isDeleted) {
        await handleSignOut();
      }
    } catch (error) {
      toast.error((error as Error).message || `Failed to Deleted Account`);
    }
  }

  // Open the confirmation modal
  const openDeleteConfirmation = function () {
    setIsDeleteConfirmationOpen(true);
  };

  // Close the confirmation modal
  const closeDeleteConfirmation = function () {
    setIsDeleteConfirmationOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8H4c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3z"
            ></path>
          </svg>
          <p className="mt-4 text-center text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="p-8 rounded-lg shadow-lg bg-white border border-red-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg text-center font-medium">{error}</p>
          <p className="mt-2 text-gray-500 text-center">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1184px] mx-auto p-4 md:p-8 font-sans min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with search and profile */}
      <UserHeader />

      {/* Page title */}
      <PageTitle title={`Profile & Settings`} tag={`Manage your account settings and preferences`} />
      
      {/* Profile Picture Component */}
      <ProfilePicture />
      
      {/* Account Settings Card */}
      <Card className="mb-6 shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl font-semibold text-[#004a7c] flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                First Name
              </label>
              <Input
                defaultValue={user?.firstName}
                className="h-[42px] font-normal text-base rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Last Name
              </label>
              <Input
                defaultValue={user?.lastName}
                className="h-[42px] font-normal text-base rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Phone Number
            </label>
            <Input
              defaultValue={user?.phoneNumber}
              className="h-[42px] font-normal text-base rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="mb-6 shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl font-semibold text-[#004a7c] flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <LockIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">Password</p>
                  <p className="text-sm text-gray-500">Secure your account with a strong password</p>
                </div>
              </div>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 px-4 py-2 rounded-md font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPhoneNumberVerificationModalOpen(true);
                }}
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <ShieldIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isTwoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={isTwoFactorEnabled}
                  onCheckedChange={() => handleToggle2FA()}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
          {/* Hidden reCAPTCHA Container */}
          <RecaptchaComponent onRecaptchaInit={handleRecaptchaInit} />
        </CardContent>
      </Card>

      {/* Account Management Card */}
      <Card className="shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl font-semibold text-[#004a7c] flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <DownloadIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">Generate Report</p>
                  <p className="text-sm text-gray-500">Download a comprehensive PDF report of your financial data</p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? 'Generating...' : 'Generate PDF Report'} 
              </Button>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-800">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently remove your account and data</p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={openDeleteConfirmation}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> 
        
      {/* Phone Number Verification Modal */}
      {isPhoneNumberVerificationModalOpen && (
        <PhoneNumberVerificationModal
          onClose={() => setIsPhoneNumberVerificationModalOpen(false)}
          onSuccess={handlePhoneVerificationSuccess}
          onFailure={handleFailure}
          isLoading={isPhoneNumberLoading}
        />
      )}
    
      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <ResetPasswordOtpVerificationModal
          onClose={() => setIsOtpModalOpen(false)}
          onSuccess={handleOTPVerificationSuccess}
          onFailure={handleFailure}
          phoneNumber={phoneNumber}
          confirmationResult={confirmationResult}
          isLoading={isOTPLoading}
        />
      )}
    
      {/* Password Reset Modal */}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
          onSuccess={handleResetPasswordSuccess}
          onFailure={handleFailure}
          phoneNumber={phoneNumber}
          isLoading={isResetPasswordLoading}
        />
      )}

      {/* Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        aria-labelledby="delete-account-confirmation-title"
        aria-describedby="delete-account-confirmation-description"
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '12px'
          }
        }}
      >
        <DialogTitle id="delete-account-confirmation-title" style={{ fontWeight: 'bold', color: '#DC2626' }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-confirmation-description">
            This action cannot be undone. All your data will be permanently deleted.
            Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeDeleteConfirmation} 
            className="text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAccountDeletion(); // Call the deletion function
              closeDeleteConfirmation(); // Close the modal
            }}
            className='bg-red-600 hover:bg-red-700 text-white'
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};
