/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { LockIcon, ShieldIcon, UserIcon, DownloadIcon, TrashIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from '../../base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../base/Card';
import { toast } from 'react-toastify';
import { useGoalStore, useInsuranceStore, useUserStore } from '@/stores/store';
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

  // Function to generate Report with styled formatting
  // Function to generate Report with styled formatting
const handleGenerateReport = async function(reportOptions = {}) {
  // Default report configuration - easily expandable
  const defaultOptions = {
    includeGoals: true,
    includeInvestments: false, // Set to false and remove from options
    includeDebts: false,
    includeInsurance: false,
    reportTitle: 'Financial Goals Report',
    reportSubtitle: 'Comprehensive Analysis & Progress Summary'
  };
  
  const options = { ...defaultOptions, ...reportOptions };
  
  // Data validation - check what data is available (removed investments)
  const availableData = {
    goals: goals && Object.keys(goals).length > 0 ? Object.values(goals) : [],
    debts: debts && Object.keys(debts).length > 0 ? Object.values(debts) : [],
    insurance: insurance && Object.keys(insurance).length > 0 ? Object.values(insurance) : []
  };
  
  // Check if any data is available for the selected options (removed investments check)
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
    // Initialize PDF document with enhanced settings
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });
    
    // Set up document properties
    doc.setProperties({
      title: options.reportTitle,
      subject: 'Personal Finance Report',
      author: `${user?.firstName} ${user?.lastName}`,
      creator: 'Financial Tracker App'
    });

    // Enhanced color palette (removed investments color)
    const colors = {
      primary: [26, 35, 126],      // Deep blue
      secondary: [63, 81, 181],     // Medium blue
      accent: [103, 58, 183],       // Purple
      success: [76, 175, 80],       // Green
      warning: [255, 152, 0],       // Orange
      error: [244, 67, 54],         // Red
      info: [33, 150, 243],         // Light blue
      text: [33, 33, 33],           // Dark gray
      textLight: [117, 117, 117],   // Light gray
      background: [248, 250, 252],  // Light blue-gray
      cardBg: [255, 255, 255],      // White
      border: [224, 224, 224],      // Light border
      
      // Category-specific colors (removed investments)
      goals: [26, 35, 126],         // Deep blue
      debts: [244, 67, 54],         // Red
      insurance: [103, 58, 183]     // Purple
    };

    // Document layout constants
    const layout = {
      margin: 20,
      pageWidth: doc.internal.pageSize.width,
      pageHeight: doc.internal.pageSize.height,
      cardPadding: 8,
      sectionSpacing: 25,
      itemSpacing: 15
    };

    let yPosition = layout.margin;
    
    // Enhanced helper function for page management
    interface PageCheckResult {
      addedNewPage: boolean;
    }

    const checkNewPage = (requiredHeight: number): PageCheckResult => {
      if (yPosition + requiredHeight > layout.pageHeight - 40) {
        doc.addPage();
        yPosition = layout.margin;
        return { addedNewPage: true };
      }
      return { addedNewPage: false };
    };

    // Enhanced text rendering with better typography
    interface TextRenderOptions {
      fontSize?: number;
      weight?: string;
      color?: number[];
    }

    const renderText = (text: string, x: number, y: number, options: TextRenderOptions = {}) => {
      doc.setFontSize(options.fontSize || 12);
      const textColor = options.color || colors.text;
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', options.weight || 'normal');
      doc.text(text, x, y);
    };

    // Dynamic header based on report content
    const renderHeader = () => {
      // Header background with gradient effect simulation
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, layout.pageWidth, 60, 'F');
      
      // Add subtle overlay for depth
      doc.setFillColor(255, 255, 255, 0.1);
      doc.rect(0, 0, layout.pageWidth, 60, 'F');
      
      // Dynamic title based on included categories (removed investments)
      const includedCategories = [];
      if (options.includeGoals) includedCategories.push('Goals');
      if (options.includeDebts) includedCategories.push('Debts');
      if (options.includeInsurance) includedCategories.push('Insurance');
      
      const dynamicTitle = includedCategories.length > 1 
        ? `Financial Report - ${includedCategories.join(', ')}`
        : options.reportTitle;
      
      // Main title with shadow effect
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(dynamicTitle, layout.margin, 35);
      
      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(200, 220, 255);
      doc.setFont('helvetica', 'normal');
      doc.text(options.reportSubtitle, layout.margin, 48);
      
      yPosition = 75;
    };

    // Enhanced user information card
    const renderUserInfo = () => {
      const cardHeight = 45;
      checkNewPage(cardHeight);
      
      // Card background with subtle shadow
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 3, 3, 'F');
      
      // Card border
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 3, 3);
      
      // User icon simulation (circular background)
      doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.circle(layout.margin + 15, yPosition + 15, 8, 'F');
      
      // User initials
      const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(initials, layout.margin + 12, yPosition + 18);
      
      // User details
      const userInfoX = layout.margin + 35;
      renderText(`${user?.firstName} ${user?.lastName}`, userInfoX, yPosition + 12, {
        fontSize: 16,
        weight: 'bold',
        color: colors.text
      });
      
      renderText(`Phone: ${user?.phoneNumber}`, userInfoX, yPosition + 25, {
        fontSize: 11,
        color: colors.textLight
      });
      
      // Generation date (right aligned)
      const dateText = `Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      
      renderText(dateText, layout.pageWidth - layout.margin - 70, yPosition + 25, {
        fontSize: 11,
        color: colors.textLight
      });
      
      yPosition += cardHeight + layout.sectionSpacing;
    };

    // Comprehensive statistics calculator (removed investments)
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
          totalPaid: availableData.debts.reduce((sum, d) => sum + ((d.initialAmount - (d.currentBalance ?? 0))  || 0), 0),
          totalRemaining: availableData.debts.reduce((sum, d) => sum + ((d.currentBalance || 0)), 0)
        },
        insurance: {
          total: availableData.insurance.length,
          totalCoverage: availableData.insurance.reduce((sum, i) => sum + (i.coverage || 0), 0),
          totalPremium: availableData.insurance.reduce((sum, i) => sum + (i.premium || 0), 0),
          activePolicies: availableData.insurance.filter(i => i.status).length
        },
        portfolio: {
          totalAssets: 0,
          totalLiabilities: 0,
          netWorth: 0,
          totalCoverage: 0
        }
      };
      
      // Calculate overall portfolio metrics (removed investments)
      stats.portfolio = {
        totalAssets: stats.goals.totalCurrent,
        totalLiabilities: stats.debts.totalRemaining,
        netWorth: stats.goals.totalCurrent - stats.debts.totalRemaining,
        totalCoverage: stats.insurance.totalCoverage
      };
      
      return stats;
    };

    // Enhanced statistics dashboard (removed investments)
    const renderStatistics = () => {
      const statsCardHeight = 100;
      checkNewPage(statsCardHeight);
      
      // Section header
      renderText('Financial Overview Dashboard', layout.margin, yPosition, {
        fontSize: 20,
        weight: 'bold',
        color: colors.primary
      });
      yPosition += layout.itemSpacing;
      
      const stats = calculateStatistics();
      const statCards = [];
      
      // Dynamic stat cards based on included categories (removed investments)
      if (options.includeGoals && stats.goals.total > 0) {
        statCards.push(
          { label: 'Goals', value: stats.goals.total.toString(), color: colors.goals, icon: '🎯' },
          { label: 'Completed', value: stats.goals.completed.toString(), color: colors.success, icon: '✅' },
          { label: 'Goal Progress', value: `₹${(stats.goals.totalCurrent / 100000).toFixed(1)}L`, color: colors.goals, icon: '📈' }
        );
      }
      
      if (options.includeDebts && stats.debts.total > 0) {
        statCards.push(
          { label: 'Debts', value: stats.debts.total.toString(), color: colors.debts, icon: '💳' },
          { label: 'Total Debt', value: `₹${(stats.debts.totalDebt / 100000).toFixed(1)}L`, color: colors.debts, icon: '📉' },
          { label: 'Remaining', value: `₹${(stats.debts.totalRemaining / 100000).toFixed(1)}L`, color: colors.error, icon: '⚠️' }
        );
      }
      
      if (options.includeInsurance && stats.insurance.total > 0) {
        statCards.push(
          { label: 'Insurance', value: stats.insurance.total.toString(), color: colors.insurance, icon: '🛡️' },
          { label: 'Coverage', value: `₹${(stats.insurance.totalCoverage / 10000000).toFixed(1)}Cr`, color: colors.insurance, icon: '🔒' },
          { label: 'Active Policies', value: stats.insurance.activePolicies.toString(), color: colors.success, icon: '✅' }
        );
      }
      
      // Portfolio summary cards (updated without investments)
      if (statCards.length > 0) {
        statCards.push(
          { label: 'Net Worth', value: `₹${(stats.portfolio.netWorth / 100000).toFixed(1)}L`, color: stats.portfolio.netWorth >= 0 ? colors.success : colors.error, icon: '💎' },
          { label: 'Total Assets', value: `₹${(stats.portfolio.totalAssets / 100000).toFixed(1)}L`, color: colors.info, icon: '🏦' }
        );
      }
      
      // Render stat cards in grid
      const cardWidth = (layout.pageWidth - 2 * layout.margin - 20) / 3;
      const cardHeight = 35;
      
      statCards.forEach((stat, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = layout.margin + col * (cardWidth + 10);
        const y = yPosition + row * (cardHeight + 10);
        
        // Card background with color accent
        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
        
        // Colored left border
        doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
        doc.roundedRect(x, y, 4, cardHeight, 2, 2, 'F');
        
        // Card border
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2);
        
        // Value (large)
        renderText(stat.value, x + 8, y + 12, {
          fontSize: 16,
          weight: 'bold',
          color: stat.color
        });
        
        // Label (small)
        renderText(stat.label, x + 8, y + 25, {
          fontSize: 9,
          color: colors.textLight
        });
        
        // Icon
        renderText(stat.icon, x + cardWidth - 15, y + 15, {
          fontSize: 12
        });
      });
      
      yPosition += Math.ceil(statCards.length / 3) * (cardHeight + 10) + layout.sectionSpacing;
    };

    // Enhanced progress bar component
    const renderProgressBar = (progress: number, x: number, y: number, width: number) => {
      const barHeight = 6;
      const progressWidth = (progress / 100) * width;
      
      // Background bar
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(x, y, width, barHeight, 3, 3, 'F');
      
      // Progress bar with gradient effect
      if (progress > 0) {
        const progressColor = progress >= 75 ? colors.success : 
                            progress >= 50 ? colors.warning : 
                            progress >= 25 ? colors.secondary : colors.error;
        
        doc.setFillColor(progressColor[0], progressColor[1], progressColor[2]);
        doc.roundedRect(x, y, progressWidth, barHeight, 3, 3, 'F');
      }
    };

    // Category-specific renderers (removed renderInvestmentsSection)
    const renderGoalsSection = () => {
      if (!options.includeGoals || availableData.goals.length === 0) return;
      
      checkNewPage(40);
      
      // Section header
      renderText('Goals Progress', layout.margin, yPosition, {
        fontSize: 18,
        weight: 'bold',
        color: colors.goals
      });
      yPosition += layout.itemSpacing;
      
      availableData.goals.forEach((goal, index) => {
        const cardHeight = 55;
        checkNewPage(cardHeight);
        
        // Goal card with enhanced styling
        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 4, 4, 'F');
        
        // Card border with category color
        doc.setDrawColor(colors.goals[0], colors.goals[1], colors.goals[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 4, 4);
        
        // Goal details rendering
        const goalProgress = goal.target_amount > 0 ? ((goal.current_amount / goal.target_amount) * 100) : 0;
        
        // Goal number badge
        doc.setFillColor(colors.goals[0], colors.goals[1], colors.goals[2]);
        doc.circle(layout.margin + 12, yPosition + 15, 8, 'F');
        
        renderText((index + 1).toString(), layout.margin + 9, yPosition + 18, {
          fontSize: 11,
          weight: 'bold',
          color: [255, 255, 255]
        });
        
        // Goal name
        const goalName = goal.goal_name.length > 25 ? goal.goal_name.substring(0, 25) + '...' : goal.goal_name;
        renderText(goalName, layout.margin + 28, yPosition + 12, {
          fontSize: 15,
          weight: 'bold',
          color: colors.text
        });
        
        // Financial details
        renderText(`₹${goal.current_amount.toLocaleString()} / ₹${goal.target_amount.toLocaleString()}`, 
                  layout.margin + 28, yPosition + 25, {
          fontSize: 11,
          color: colors.textLight
        });
        
        // Progress bar
        renderProgressBar(goalProgress, layout.margin + 28, yPosition + 30, 100);
        
        // Progress percentage
        renderText(`${goalProgress.toFixed(1)}%`, layout.margin + 135, yPosition + 35, {
          fontSize: 10,
          weight: 'bold',
          color: goalProgress >= 75 ? colors.success : 
                 goalProgress >= 50 ? colors.warning : colors.secondary
        });
        
        // Target date
        renderText(`Target: ${new Date(goal.target_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}`, layout.pageWidth - layout.margin - 60, yPosition + 25, {
          fontSize: 10,
          color: colors.textLight
        });
        
        // Status badge
        const statusText = goal.is_completed ? 'COMPLETED' : 'IN PROGRESS';
        const statusColor = goal.is_completed ? colors.success : colors.warning;
        const badgeWidth = goal.is_completed ? 30 : 35;
        
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.roundedRect(layout.pageWidth - layout.margin - badgeWidth - 5, yPosition + 8, badgeWidth, 12, 6, 6, 'F');
        
        renderText(statusText, layout.pageWidth - layout.margin - badgeWidth, yPosition + 16, {
          fontSize: 7,
          weight: 'bold',
          color: [255, 255, 255]
        });
        
        yPosition += cardHeight + 12;
      });
      
      yPosition += layout.sectionSpacing;
    };

    const renderDebtsSection = () => {
      if (!options.includeDebts || availableData.debts.length === 0) return;
      
      checkNewPage(40);
      
      renderText('Debt Management', layout.margin, yPosition, {
        fontSize: 18,
        weight: 'bold',
        color: colors.debts
      });
      yPosition += layout.itemSpacing;
      
      availableData.debts.forEach((debt, index) => {
        const cardHeight = 65;
        checkNewPage(cardHeight);
        
        // Debt card with enhanced styling
        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 4, 4, 'F');
        
        // Card border with category color
        doc.setDrawColor(colors.debts[0], colors.debts[1], colors.debts[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 4, 4);
        
        // Debt details rendering
        const debtProgress = debt.initialAmount > 0 ? (((debt.initialAmount - (debt.currentBalance || 0)) / debt.initialAmount) * 100) : 0;
        
        // Debt number badge
        doc.setFillColor(colors.debts[0], colors.debts[1], colors.debts[2]);
        doc.circle(layout.margin + 12, yPosition + 15, 8, 'F');
        
        renderText((index + 1).toString(), layout.margin + 9, yPosition + 18, {
          fontSize: 11,
          weight: 'bold',
          color: [255, 255, 255]
        });
        
        // Debt name and type
        const debtName = debt.debtName.length > 20 ? debt.debtName.substring(0, 20) + '...' : debt.debtName;
        renderText(debtName, layout.margin + 28, yPosition + 12, {
          fontSize: 15,
          weight: 'bold',
          color: colors.text
        });
        
        // Interest rate and type
        renderText(`${debt.interestRate}% ${debt.interestType}`, layout.margin + 28, yPosition + 25, {
          fontSize: 10,
          color: colors.textLight
        });
        
        // Financial details
        renderText(`Current: ₹${debt.currentBalance?.toLocaleString()} / Initial: ₹${debt.initialAmount.toLocaleString()}`, 
                  layout.margin + 28, yPosition + 35, {
          fontSize: 11,
          color: colors.textLight
        });
        
        // Progress bar (amount paid)
        renderProgressBar(debtProgress, layout.margin + 28, yPosition + 42, 100);
        
        // Progress percentage
        renderText(`${debtProgress.toFixed(1)}% Paid`, layout.margin + 135, yPosition + 47, {
          fontSize: 10,
          weight: 'bold',
          color: debtProgress >= 75 ? colors.success : 
                debtProgress >= 50 ? colors.warning : colors.error
        });
        
        // Monthly payment
        renderText(`Monthly: ₹${debt.monthlyPayment?.toLocaleString()}`, layout.margin + 28, yPosition + 55, {
          fontSize: 10,
          color: colors.textLight
        });
        
        // Next due date
        renderText(`Next Due: ${debt.nextDueDate ? new Date(debt.nextDueDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : 'Not Set'}`, layout.pageWidth - layout.margin - 65, yPosition + 25, {
          fontSize: 10,
          color: colors.textLight
        });
        
        // Status and debt type badges
        const statusText = debt.status?.toUpperCase();
        const debtTypeText = debt.isGoodDebt ? 'GOOD DEBT' : 'BAD DEBT';
        const statusColor = debt.status === 'Active' ? colors.success : colors.warning;
        const debtTypeColor = debt.isGoodDebt ? colors.info : colors.error;
        
        // Status badge
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.roundedRect(layout.pageWidth - layout.margin - 35, yPosition + 8, 30, 10, 5, 5, 'F');
        
        renderText(statusText || 'N/A', layout.pageWidth - layout.margin - 30, yPosition + 15, {
          fontSize: 7,
          weight: 'bold',
          color: [255, 255, 255]
        });
        
        // Debt type badge
        doc.setFillColor(debtTypeColor[0], debtTypeColor[1], debtTypeColor[2]);
        doc.roundedRect(layout.pageWidth - layout.margin - 40, yPosition + 35, 35, 10, 5, 5, 'F');
        
        renderText(debtTypeText, layout.pageWidth - layout.margin - 35, yPosition + 42, {
          fontSize: 6,
          weight: 'bold',
          color: [255, 255, 255]
        });
        
        // Tenure information
        renderText(`Tenure: ${debt.tenureMonths} months`, layout.pageWidth - layout.margin - 65, yPosition + 55, {
          fontSize: 9,
          color: colors.textLight
        });
        
        yPosition += cardHeight + 12;
      });
      
      yPosition += layout.sectionSpacing;
    };

    const renderInsuranceSection = () => {
      if (!options.includeInsurance || availableData.insurance.length === 0) return;
      
      checkNewPage(40);
      
      renderText('Insurance Coverage', layout.margin, yPosition, {
        fontSize: 18,
        weight: 'bold',
        color: colors.insurance
      });
      yPosition += layout.itemSpacing;
      
      // Placeholder for insurance - will be implemented in next phase
      const cardHeight3 = 40;
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight3, 4, 4, 'F');
      
      doc.setDrawColor(colors.insurance[0], colors.insurance[1], colors.insurance[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight3, 4, 4);
      
      renderText('🛡️ Insurance details will be displayed here', layout.margin + 15, yPosition + 15, {
        fontSize: 12,
        color: colors.textLight
      });
      
      renderText('Coming in next phase...', layout.margin + 15, yPosition + 28, {
        fontSize: 10,
        color: colors.insurance
      });
      
      yPosition += cardHeight3 + layout.sectionSpacing;
    };

    // Enhanced financial health summary (updated without investments)
    const renderHealthSummary = () => {
      checkNewPage(60);
      
      const stats = calculateStatistics();
      
      // Health summary card
      const cardHeight = 60;
      doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      doc.roundedRect(layout.margin, yPosition, layout.pageWidth - 2 * layout.margin, cardHeight, 4, 4, 'F');
      
      // Header
      renderText('Financial Health Assessment', layout.margin + 10, yPosition + 15, {
        fontSize: 16,
        weight: 'bold',
        color: colors.primary
      });
      
      // Dynamic health message based on included categories (updated without investments)
      let healthMessage = '';
      let healthColor = colors.text;
      
      if (options.includeGoals && stats.goals.total > 0) {
        const goalProgress = stats.goals.totalTarget > 0 ? (stats.goals.totalCurrent / stats.goals.totalTarget) * 100 : 0;
        
        if (goalProgress >= 75) {
          healthMessage = '🎉 Excellent goal progress! You are on track to achieve your financial objectives.';
          healthColor = colors.success;
        } else if (goalProgress >= 50) {
          healthMessage = '👍 Good progress on your goals. Keep up the consistent effort.';
          healthColor = colors.warning;
        } else {
          healthMessage = '📈 Building momentum on your goals. Consider increasing your savings rate.';
          healthColor = colors.secondary;
        }
      } else {
        healthMessage = '🚀 Your financial journey is progressing. Stay consistent with your financial planning.';
        healthColor = colors.info;
      }
      
      renderText(healthMessage, layout.margin + 10, yPosition + 30, {
        fontSize: 12,
        color: healthColor
      });
      
      // Net worth indicator (if applicable)
      if (stats.portfolio.netWorth !== 0) {
        const netWorthText = stats.portfolio.netWorth > 0 
          ? `💰 Positive Net Worth: ₹${(stats.portfolio.netWorth / 100000).toFixed(1)}L`
          : `⚠️ Net Worth: ₹${(stats.portfolio.netWorth / 100000).toFixed(1)}L`;
        
        renderText(netWorthText, layout.margin + 10, yPosition + 45, {
          fontSize: 11,
          color: stats.portfolio.netWorth > 0 ? colors.success : colors.error
        });
      }
      
      yPosition += cardHeight + 20;
    };

    // Enhanced footer for all pages
    const addFooters = () => {
      const pageCount = doc.internal.pages.length - 1;
      
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer background
        doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
        doc.rect(0, layout.pageHeight - 35, layout.pageWidth, 35, 'F');
        
        // Footer line
        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(1);
        doc.line(layout.margin, layout.pageHeight - 30, layout.pageWidth - layout.margin, layout.pageHeight - 30);
        
        // Footer content
        renderText(`Page ${i} of ${pageCount}`, layout.pageWidth - 40, layout.pageHeight - 18, {
          fontSize: 9,
          color: colors.textLight
        });
        
        renderText('Financial Tracker App', layout.margin, layout.pageHeight - 18, {
          fontSize: 9,
          weight: 'bold',
          color: colors.primary
        });
        
        renderText(`Report generated on ${new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`, layout.margin, layout.pageHeight - 10, {
          fontSize: 8,
          color: colors.textLight
        });
      }
    };

    // Render all sections based on options (removed renderInvestmentsSection call)
    renderHeader();
    renderUserInfo();
    renderStatistics();
    renderGoalsSection();
    renderDebtsSection();
    renderInsuranceSection();
    renderHealthSummary();
    addFooters();

    // Save the PDF with dynamic filename (updated without investments)
    const timestamp = new Date().toISOString().split('T')[0];
    const includedCategories = [];
    if (options.includeGoals) includedCategories.push('goals');
    if (options.includeDebts) includedCategories.push('debts');
    if (options.includeInsurance) includedCategories.push('insurance');
    
    const fileName = `financial-report-${includedCategories.join('-')}-${timestamp}.pdf`;
    doc.save(fileName);
    
    toast.success('Comprehensive financial report generated successfully!');
    
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
