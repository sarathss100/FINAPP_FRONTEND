"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from '@/components/base/Dialog';
import { 
  Calendar, IndianRupee, Target, Clock, 
  Save, AlertCircle
} from "lucide-react";
import Button from "@/components/base/Button";
import { IGoal } from '@/types/IGoal';
// import { Badge } from '@/components/base/Badge';
import Input from '@/components/base/Input';
import { Select } from '@/components/base/newSelect';
import Label from '@/components/base/Label';
// import { Textarea } from '@/components/base/TextArea';

interface GoalEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalData: IGoal | null;
  onSaveGoal: (goalData: IGoal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

// Goal Categories
// const GOAL_CATEGORIES = [
//   "Education", "Emergency Fund", "Retirement", "Home", "Vehicle",
//   "Vacation", "Wedding", "Healthcare", "Business", "Other"
// ];
const GOAL_CATEGORIES = ["Education", "Retirement", "Travel", "Investment", "Other"];

// Goal Types
const GOAL_TYPES = ['Savings', 'Investment', 'Debt Repayment', 'Other'];

// Priority Levels
const PRIORITY_LEVELS = ["Low", "Medium", "High"];

// Contribution Frequencies
const CONTRIBUTION_FREQUENCIES = ["Monthly", "Quarterly", "Yearly"];

// Reminder Frequencies
const REMINDER_FREQUENCIES = ["None", "Daily", "Weekly", "Monthly"];

export const GoalEditModal = ({ 
  isOpen, 
  onClose, 
  goalData, 
  onSaveGoal,
}: GoalEditModalProps) => {
  const [formData, setFormData] = useState<IGoal | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (goalData) {
      setFormData({...goalData});
      setIsFormDirty(false);
      setErrors({});
    }
  }, [goalData, isOpen]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: unknown = value;
    
    // Parse number inputs
    if (name === 'target_amount' || name === 'initial_investment' || name === 'current_amount') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => prev ? ({
      ...prev,
      [name]: parsedValue
    }) : null);
    
    setIsFormDirty(true);
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: new Date(value).toISOString()
    }) : null);
    setIsFormDirty(true);
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData?.target_amount < formData?.current_amount) {
      newErrors.current_amount = "Current amount cannot be greater than target amount";
    }

    if (formData?.target_amount < formData?.initial_investment) {
      newErrors.initial_investment = "Current amount cannot be greater than target amount";
    }

    if (!formData?.goal_name?.trim()) {
      newErrors.goal_name = "Goal name is required";
    }
    
    if (!formData?.target_amount || formData.target_amount <= 0) {
      newErrors.target_amount = "Valid target amount is required";
    }
    
    if (!formData?.target_date) {
      newErrors.target_date = "Target date is required";
    } else {
      const targetDate = new Date(formData.target_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (targetDate < today) {
        newErrors.target_date = "Target date must be in the future";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !formData) return;
    
    // Calculate contribution amounts based on remaining amount and time
    const targetDate = new Date(formData.target_date);
    const today = new Date();
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const remainingAmount = formData.target_amount - formData.current_amount;
    
    const dailyContribution = daysRemaining > 0 ? remainingAmount / daysRemaining : 0;
    const monthlyContribution = daysRemaining > 0 ? (remainingAmount / daysRemaining) * 30 : 0;
    
    const updatedGoal = {
      ...formData,
      dailyContribution,
      monthlyContribution,
      updatedAt: new Date().toISOString()
    };
    
    onSaveGoal(updatedGoal);
  };

  // Format date for input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* <DialogContent className="relative pb-0">
          <div className="flex justify-between items-center gap-4 pt-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              EditGoal
            </DialogTitle>
          </div>
        </DialogContent> */}
        
        <div className="mt-6 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal_name">Goal Name</Label>
                <Input 
                  id="goal_name"
                  name="goal_name"
                  value={formData.goal_name || ''}
                  onChange={handleChange}
                  className={errors.goal_name ? "border-red-500" : ""}
                />
                {errors.goal_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.goal_name}</p>
                )}
              </div>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal_category">Category</Label>
                  <Select 
                    id="goal_category"
                    name="goal_category"
                    value={formData.goal_category || ''}
                    onChange={handleChange}
                  >
                    {GOAL_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goal_type">Goal Type</Label>
                  <Select 
                    id="goal_type"
                    name="goal_type"
                    value={formData.goal_type || ''}
                    onChange={handleChange}
                  >
                    {GOAL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority_level">Priority Level</Label>
                  <Select 
                    id="priority_level"
                    name="priority_level"
                    value={formData.priority_level || ''}
                    onChange={handleChange}
                  >
                    {PRIORITY_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    id="currency"
                    name="currency"
                    value={formData.currency || 'INR'}
                    onChange={handleChange}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Details Section */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
              Financial Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="target_amount">Target Amount</Label>
                  <Input 
                    id="target_amount"
                    name="target_amount"
                    type="number"
                    value={formData.target_amount || 0}
                    onChange={handleChange}
                    className={errors.target_amount ? "border-red-500" : ""}
                    min={0}
                  />
                  {errors.target_amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="current_amount">Current Savings</Label>
                  <Input 
                    id="current_amount"
                    name="current_amount"
                    type="number"
                    value={formData.current_amount || 0}
                    onChange={handleChange}
                    min={0}
                  />
                  {errors.current_amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.current_amount}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="initial_investment">Initial Investment</Label>
                  <Input 
                    id="initial_investment"
                    name="initial_investment"
                    type="number"
                    value={formData.initial_investment || 0}
                    onChange={handleChange}
                    min={0}
                  />
                </div>
                {errors.initial_investment && (
                  <p className="text-red-500 text-sm mt-1">{errors.initial_investment}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_date">Target Date</Label>
                  <div className="relative">
                    <Input 
                      id="target_date"
                      name="target_date"
                      type="date"
                      value={formatDateForInput(String(formData.target_date) || '')}
                      onChange={handleDateChange}
                      className={`pl-10 ${errors.target_date ? "border-red-500" : ""}`}
                    />
                    <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.target_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.target_date}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="is_completed">Goal Status</Label>
                  <Select 
                    id="is_completed"
                    name="is_completed"
                    value={formData.is_completed ? "true" : "false"}
                    onChange={(e) => {
                      setFormData(prev => prev ? ({
                        ...prev,
                        is_completed: e.target.value === "true"
                      }) : null);
                      setIsFormDirty(true);
                    }}
                  >
                    <option value="false">In Progress</option>
                    <option value="true">Completed</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contribution Plan Section */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Contribution Plan
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="contribution_frequency">Contribution Frequency</Label>
                  <Select 
                    id="contribution_frequency"
                    name="contribution_frequency"
                    value={formData.contribution_frequency || ''}
                    onChange={handleChange}
                  >
                    {CONTRIBUTION_FREQUENCIES.map(frequency => (
                      <option key={frequency} value={frequency}>{frequency}</option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminder_frequency">Reminder Frequency</Label>
                  <Select 
                    id="reminder_frequency"
                    name="reminder_frequency"
                    value={formData.reminder_frequency || 'None'}
                    onChange={handleChange}
                  >
                    {REMINDER_FREQUENCIES.map(frequency => (
                      <option key={frequency} value={frequency}>{frequency}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Label>Calculated Contributions</Label>
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Daily:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: formData.currency || 'INR',
                          maximumFractionDigits: 0
                        }).format(formData.dailyContribution || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: formData.currency || 'INR',
                          maximumFractionDigits: 0
                        }).format(formData.monthlyContribution || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tags Section */}
          {/* <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tags</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags && formData.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  className="bg-gray-100 text-gray-800 flex items-center gap-1 px-2 py-1"
                >
                  {tag}
                  <button 
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(!formData.tags || formData.tags.length === 0) && (
                <span className="text-gray-500 text-sm italic">No tags added yet</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Add a tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                className="flex-1"
              />
              <Button 
                type="button"
                onClick={addTag}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Add
              </Button>
            </div>
          </div> */}
          
          {/* Notes or Description */}
          {/* <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>
            
            <Textarea 
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Add any additional notes about this goal..."
            />
          </div> */}
        </div>
        
        {/* Bottom Action Bar */}
        <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-200">
          <div className="flex gap-2">
            <Button 
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={!isFormDirty}
              className={`bg-blue-600 hover:bg-blue-700 text-white flex items-center ${!isFormDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
        
        {/* Warning for unsaved changes */}
        {isFormDirty && (
          <div className="mt-4 flex items-center p-3 bg-amber-50 text-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">You have unsaved changes. Please save before closing.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
