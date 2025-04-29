"use client";
import React from "react";
import { Badge } from '@/components/base/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/Dialog';
import { 
  Calendar, IndianRupee, Target, Clock, AlertCircle, CheckCircle,
  TrendingUp, RefreshCw, Bell
} from "lucide-react";
import Button from "@/components/base/Button";
import { toast } from 'react-toastify';
import { IGoal } from '@/types/IGoal';

interface GoalDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalData: IGoal | null;
    onEditGoal: (goalId: string) => void;
    onAddContribution: (goalId: string, goalName: string) => void;
}

// Goal Details Modal Component
export const GoalDetailsModal = ({ 
  isOpen, 
  onClose, 
  goalData, 
  onEditGoal,
  onAddContribution
}: GoalDetailsModalProps) => {
  if (!goalData) return null;
  
  // Calculate completion percentage
  const completionPercentage = Math.min(
    Math.round(((goalData.target_amount - goalData.current_amount) * 100) / goalData.target_amount ),
    100
  );
  
  // Calculate remaining amount
  const remainingAmount = Math.max(goalData.current_amount, 0);
  
  // Calculate days remaining
  const targetDate = new Date(goalData.target_date);
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine status based on completion and target date
  let status = "In Progress";
  let statusColor = "bg-amber-100 text-amber-800";
  let statusIcon = <Clock className="w-4 h-4 mr-1" />;
    
  if (goalData.is_completed || completionPercentage === 100) {
    status = "Completed";
    statusColor = "bg-emerald-100 text-emerald-800";
    statusIcon = <CheckCircle className="w-4 h-4 mr-1" />;
  } else if (daysRemaining < 0) {
    status = "Overdue";
    statusColor = "bg-red-100 text-red-800";
    statusIcon = <AlertCircle className="w-4 h-4 mr-1" />;
  } else if (daysRemaining < 30 && completionPercentage < 70) {
    status = "At Risk";
    statusColor = "bg-red-100 text-red-800";
    statusIcon = <AlertCircle className="w-4 h-4 mr-1" />;
  }
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: goalData.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle contribution - now connecting to the main contribution flow
  const handleContribute = () => {
    if (goalData && goalData._id) {
      onClose(); // Close the current modal
      onAddContribution(goalData._id, goalData.goal_name);
    }
  };
  
  // Determine priority color
  let priorityColor = "bg-blue-100 text-blue-800"; // Default for Medium
  if (goalData.priority_level === "High") {
    priorityColor = "bg-red-100 text-red-800";
  } else if (goalData.priority_level === "Critical") {
    priorityColor = "bg-purple-100 text-purple-800";
  } else if (goalData.priority_level === "Low") {
    priorityColor = "bg-gray-100 text-gray-800";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <Badge 
                className={`rounded-full mb-3 ${statusColor} flex items-center w-fit px-2 py-1`}
                variant="outline"
              >
                {statusIcon}
                {status}
              </Badge>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {goalData.goal_name}
              </DialogTitle>
            </div>
            
            <div className="flex gap-2">
              {status !== "Completed" && (
                <Button 
                  onClick={handleContribute}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                >
                  <IndianRupee className="w-4 h-4 mr-1" />
                  Add Contribution
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        {/* Progress Section */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-6 mb-6 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Progress Tracker</h3>
              <p className="text-sm text-gray-500">
                {formatCurrency(goalData.target_amount - goalData.current_amount)} of {formatCurrency(goalData.target_amount)} saved
              </p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
              <p className="text-sm text-gray-500">completion</p>
            </div>
          </div>
          
          <div className="w-full bg-white rounded-full h-3 mb-4 overflow-hidden shadow-inner">
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-in-out" 
              style={{ 
                width: `${completionPercentage}%`, 
                backgroundColor: completionPercentage === 100 ? '#10b981' : completionPercentage < 30 ? '#ef4444' : '#0ea5e9'
              }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-blue-100 p-2 mr-3">
                <IndianRupee className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="font-semibold text-gray-800">{formatCurrency(remainingAmount)}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-amber-100 p-2 mr-3">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Date</p>
                <p className="font-semibold text-gray-800">{formatDate(String(goalData.target_date))}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-emerald-100 p-2 mr-3">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Remaining</p>
                <p className="font-semibold text-gray-800">
                  {daysRemaining < 0 ? "Overdue" : daysRemaining + " days"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Goal Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Goal Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Category</span>
                <Badge className="bg-blue-50 text-blue-700 px-2 py-1">
                  {goalData.goal_category}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Goal Type</span>
                <span className="font-medium">{goalData.goal_type}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Priority</span>
                <Badge className={`${priorityColor} px-2 py-1`}>
                  {goalData.priority_level}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Target Amount</span>
                <span className="font-medium">{formatCurrency(goalData.target_amount)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Remaining Amount</span>
                <span className="font-medium">{formatCurrency(goalData.current_amount)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2">
                <span className="text-gray-600">Initial Investment</span>
                <span className="font-medium">{formatCurrency(goalData.initial_investment)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Contribution Plan
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Contribution Frequency</span>
                <span className="font-medium">{goalData.contribution_frequency}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Daily Contribution</span>
                <span className="font-medium">{formatCurrency(goalData.dailyContribution ?? 0)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Monthly Contribution</span>
                <span className="font-medium">{formatCurrency(goalData.monthlyContribution ?? 0)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Reminder Frequency</span>
                <span className="font-medium">
                  {goalData.reminder_frequency === "None" ? "Not set" : goalData.reminder_frequency}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Created On</span>
                <span className="font-medium">{formatDate(`${goalData.createdAt || new Date()}`)}</span>
              </div>
              
              <div className="flex items-center pt-2">
                {goalData.tags && goalData.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {goalData.tags.map((tag: string, index: number) => (
                      <Badge key={index} className="bg-gray-100 text-gray-700 px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm italic">No tags added</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions Section */}
        <div className="flex flex-wrap justify-between items-center pt-2 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" /> 
            Last updated: {formatDate(`${goalData.updatedAt || new Date()}`)}
          </div>
          
          <div className="flex gap-2 mt-3 sm:mt-0">
            {status !== "Completed" && (
              <Button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center"
                onClick={() => onEditGoal(goalData._id)}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Adjust Plan
              </Button>
            )}
            
            {status !== "Completed" && (
              <Button
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 flex items-center"
                onClick={() => toast.info("Feature coming soon!")}
              >
                <Bell className="w-4 h-4 mr-1" />
                Set Reminder
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
