"use client";
import React, { useState } from "react";
import { Badge } from '@/components/base/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';
import { 
  Edit2, Trash2, Eye, AlertCircle, CheckCircle, Clock, 
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, 
  IndianRupee
} from "lucide-react";
import Button from "@/components/base/Button";
import { toast } from 'react-toastify';
import { deleteGoal, getGoalDetails } from '@/service/goalService';
import { useGoalStore } from '@/stores/store';
import { GoalDetailsModal } from '../GoalViewModal';

export const MainContentSection = () => {
  const fetchAllGoals = useGoalStore((state) => state.fetchAllGoals);
  const fetchCategoryByGoals = useGoalStore((state) => state.fetchCategoryByGoals);
  const fetchLongestTimePeriod = useGoalStore((state) => state.fetchLongestTimePeriod);
  const fetchTotalActiveGoalAmount = useGoalStore((state) => state.fetchTotalActiveGoalAmount);
  const fetchSmartAnalysis = useGoalStore((state) => state.fetchSmartAnalysis);
  const fetchDailyContribution = useGoalStore((state) => state.fetchDailyContribution);
  const fetchMonthlyContribution = useGoalStore((state) => state.fetchMonthlyContribution);
  const goals = useGoalStore((state) => state.goals);

  const globalFetch = function () {
    fetchAllGoals();
    fetchCategoryByGoals();
    fetchLongestTimePeriod();
    fetchTotalActiveGoalAmount();
    fetchSmartAnalysis();
    fetchDailyContribution();
    fetchMonthlyContribution();
  }

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isViewGoalModal, setIsViewGoalModal] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate status and completion data for each goal
  const processedGoals = Object.values(goals).map(goal => {
    // Calculate completion percentage
    const completionPercentage = Math.min(100 - Math.round((goal.current_amount / goal.target_amount) * 100), 100);
    
    // Determine status based on completion and target date
    let status = "In Progress";
    let statusColor = "bg-amber-100 text-amber-800";
    let statusIcon = <Clock className="w-3 h-3 mr-1" />;
    
    if (goal.is_completed || completionPercentage === 100) {
      status = "Completed";
      statusColor = "bg-emerald-100 text-emerald-800";
      statusIcon = <CheckCircle className="w-3 h-3 mr-1" />;
    } else {
      // Check if target date is approaching (within 30 days)
      const targetDate: Date = new Date(goal.target_date);
      const today: Date = new Date();
      const daysRemaining: number = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining < 0) {
        status = "Overdue";
        statusColor = "bg-red-100 text-red-800";
        statusIcon = <AlertCircle className="w-3 h-3 mr-1" />;
      } else if (daysRemaining < 30 && completionPercentage < 70) {
        status = "At Risk";
        statusColor = "bg-red-100 text-red-800";
        statusIcon = <AlertCircle className="w-3 h-3 mr-1" />;
      }
    }
    
    // Format dates
    const formattedTargetDate = new Date(goal.target_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const formattedCreatedDate = new Date(goal.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Determine priority color
    let priorityColor = "bg-blue-100 text-blue-800"; // Default for Medium
    
    if (goal.priority_level === "High") {
      priorityColor = "bg-red-100 text-red-800";
    } else if (goal.priority_level === "Critical") {
      priorityColor = "bg-purple-100 text-purple-800";
    } else if (goal.priority_level === "Low") {
      priorityColor = "bg-gray-100 text-gray-800";
    }
    
    // Calculate pending amount
    const pendingAmount = Math.max(goal.target_amount - goal.current_amount, 0);
    
    // Format currency amounts
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: goal.currency || 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    return {
      ...goal,
      name: goal.goal_name,
      amount: formatCurrency(goal.target_amount),
      pendingAmount: formatCurrency(pendingAmount),
      priorityLevel: goal.priority_level,
      priorityColor,
      targetDate: formattedTargetDate,
      status,
      statusColor,
      statusIcon,
      completion: completionPercentage,
      createdAt: formattedCreatedDate
    };
  });

  // Filtered goals based on status and search term
  const filteredGoals = processedGoals.filter((goal) => {
    const matchesStatus = statusFilter === "all" || goal.status === statusFilter;
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGoals = filteredGoals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGoals.length / itemsPerPage);

  // Handler functions
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleEdit = (goalId: string) => {
    console.log(`Editing goal with ID: ${goalId}`);
    // Implementation for edit functionality
  };

  const handleDelete = async (goalId: string) => {
    try {
      const response = await deleteGoal(goalId);
      if (response.data) {
        toast.success(response.message || `Your goal has been successfully deleted. You can always create a new one whenever you're ready!`);
      } 
      setTimeout(() => {
        globalFetch();
      }, 300);
    } catch (error) {
      toast.error((error as Error).message || `Oops! Something went wrong. Please try again later or contact support if the issue persists.`);
    }
  };

  const handleView = async (goalId: string) => {
    try {
      const response = await getGoalDetails(goalId);
      if (response.success) {
        setSelectedGoal(response.data.goalDetails);
        setIsViewGoalModal(true);
      }
    } catch (error) {
      toast.error((error as Error).message || `Oops! Something went wrong. Please try again later or contact support if the issue persists.`);
    }
  };

  const handleContribute = (goalId: string) => {
    console.log(`Contributing to goal with ID: ${goalId}`);
    // Implementation for contribution functionality
  };

  return (
    <Card className="py-6 w-full rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <CardTitle className="text-xl font-semibold">
            Financial Goals
          </CardTitle>
          <div className="text-sm flex items-center">
            <span className="mr-3">{filteredGoals.length} goals • {filteredGoals.filter(g => g.status === "Completed").length} completed</span>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white text-sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00a9e0] focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex space-x-2">
                {["all", "In Progress", "Completed", "At Risk", "Overdue"].map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`${
                      statusFilter === status
                        ? "bg-[#004a7c] text-white"
                        : "bg-white text-gray-700 border border-gray-300"
                    } text-sm px-3 py-1 h-auto`}
                  >
                    {status === "all" ? "All" : status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Goal Name
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Target Amount
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Pending Amount
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Priority Level
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Target Date
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Status
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Completion
                </TableHead>
                <TableHead className="font-medium text-xs tracking-wider text-gray-600 py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGoals.length > 0 ? (
                currentGoals.map((goal) => (
                  <TableRow
                    key={goal._id}
                    className={`border-t border-solid hover:bg-gray-50 transition-colors duration-150`}
                  >
                    <TableCell className="py-4 font-medium text-gray-900">
                      <div>
                        {goal.name}
                        <div className="text-xs text-gray-500 mt-1">Created: {goal.createdAt}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-normal text-gray-700">
                      {goal.amount}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-gray-700">
                      {goal.pendingAmount}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={`rounded-full font-medium text-xs px-2 py-1 ${goal.priorityColor}`}
                        variant="outline"
                      >
                        {goal.priorityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-normal text-gray-700">
                      {goal.targetDate}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={`rounded-full font-medium text-xs px-2 py-1 ${goal.statusColor} flex items-center`}
                        variant="outline"
                      >
                        {goal.statusIcon}
                        {goal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${goal.completion}%`, 
                            backgroundColor: goal.completion === 100 ? '#10b981' : goal.completion < 30 ? '#ef4444' : '#f59e0b'
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{goal.completion}%</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex space-x-2">
                        {goal.status !== "Completed" && (
                          <Button
                            onClick={() => handleContribute(goal._id)}
                            className="w-8 h-8 p-0 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                            title="Add Contribution"
                          >
                            <IndianRupee className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleView(goal._id)}
                          className="w-8 h-8 p-0 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(goal._id)}
                          className="w-8 h-8 p-0 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(goal._id)}
                          className="w-8 h-8 p-0 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No goals found</h3>
                      <p className="text-gray-500">Try adjusting your filters or search term</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination and Controls */}
        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredGoals.length)} of {filteredGoals.length} goals
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-gray-500">Show:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded p-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex space-x-1">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 p-0 flex items-center justify-center rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 p-0 ${
                    currentPage === page
                      ? "bg-[#004a7c] text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`w-8 h-8 p-0 flex items-center justify-center rounded ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              className="bg-green-600 text-white hover:bg-green-700 flex items-center"
              onClick={() => console.log("Quick contribution clicked")}
            >
              <IndianRupee className="w-4 h-4 mr-1" />
              Quick Contribute
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Goal Details Modal */}
      <GoalDetailsModal
        isOpen={isViewGoalModal}
        onClose={() => setIsViewGoalModal(false)}
        goalData={selectedGoal}
        onEditGoal={(goalId: string) => {
          setIsViewGoalModal(false);
          handleEdit(goalId);
        }}
      />

    </Card>
  );
};
