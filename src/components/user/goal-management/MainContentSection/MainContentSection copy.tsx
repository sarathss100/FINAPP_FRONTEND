import React, { useState } from "react";
import { Badge } from '@/components/base/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';
import { 
  Edit2, Trash2, Eye, AlertCircle, CheckCircle, Clock, 
  DollarSign, ChevronLeft, ChevronRight, Search, SlidersHorizontal 
} from "lucide-react";
import Button from "@/components/base/Button";

export const MainContentSectionDemo = () => {
  
  // Sample expanded data for the goal list table
  const allGoals = [
    {
      name: "Credit Card A",
      amount: "$3,200",
      pendingAmount: "$1,800",
      priorityLevel: "High",
      priorityColor: "bg-red-100 text-red-800",
      targetDate: "Dec 31, 2025",
      status: "In Progress",
      statusColor: "bg-amber-100 text-amber-800",
      statusIcon: <Clock className="w-3 h-3 mr-1" />,
      completion: 45,
      createdAt: "Jan 5, 2025"
    },
    {
      name: "Personal Loan",
      amount: "$1,580",
      pendingAmount: "$0",
      priorityLevel: "Medium",
      priorityColor: "bg-blue-100 text-blue-800",
      targetDate: "Jun 15, 2025",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-800",
      statusIcon: <CheckCircle className="w-3 h-3 mr-1" />,
      completion: 100,
      createdAt: "Oct 10, 2024"
    },
    {
      name: "Emergency Fund",
      amount: "$5,000",
      pendingAmount: "$3,500",
      priorityLevel: "Critical",
      priorityColor: "bg-purple-100 text-purple-800",
      targetDate: "Aug 20, 2025",
      status: "At Risk",
      statusColor: "bg-red-100 text-red-800",
      statusIcon: <AlertCircle className="w-3 h-3 mr-1" />,
      completion: 30,
      createdAt: "Feb 15, 2025"
    },
    {
      name: "Car Down Payment",
      amount: "$2,500",
      pendingAmount: "$0",
      priorityLevel: "Low",
      priorityColor: "bg-gray-100 text-gray-800",
      targetDate: "Mar 10, 2025",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-800",
      statusIcon: <CheckCircle className="w-3 h-3 mr-1" />,
      completion: 100,
      createdAt: "Sep 5, 2024"
    },
    {
      name: "Home Renovation",
      amount: "$15,000",
      pendingAmount: "$10,200",
      priorityLevel: "Medium",
      priorityColor: "bg-blue-100 text-blue-800",
      targetDate: "Nov 30, 2026",
      status: "In Progress",
      statusColor: "bg-amber-100 text-amber-800",
      statusIcon: <Clock className="w-3 h-3 mr-1" />,
      completion: 32,
      createdAt: "Mar 1, 2025"
    },
    {
      name: "Wedding Fund",
      amount: "$8,000",
      pendingAmount: "$0",
      priorityLevel: "High",
      priorityColor: "bg-red-100 text-red-800",
      targetDate: "Oct 15, 2024",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-800",
      statusIcon: <CheckCircle className="w-3 h-3 mr-1" />,
      completion: 100,
      createdAt: "Jan 20, 2024"
    },
    {
      name: "Vacation Trip",
      amount: "$3,000",
      pendingAmount: "$1,200",
      priorityLevel: "Low",
      priorityColor: "bg-gray-100 text-gray-800",
      targetDate: "Jul 1, 2025",
      status: "In Progress",
      statusColor: "bg-amber-100 text-amber-800",
      statusIcon: <Clock className="w-3 h-3 mr-1" />,
      completion: 60,
      createdAt: "Dec 12, 2024"
    }
  ];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filtered goals based on status and search term
  const filteredGoals = allGoals.filter((goal) => {
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

  const handleEdit = (goalName: string) => {
    console.log(`Editing goal: ${goalName}`);
    // Implementation for edit functionality
  };

  const handleDelete = (goalName: string) => {
    console.log(`Deleting goal: ${goalName}`);
    // Implementation for delete functionality
  };

  const handleView = (goalName: string) => {
    console.log(`Viewing goal: ${goalName}`);
    // Implementation for view functionality
  };

  const handleContribute = (goalName: string) => {
    console.log(`Contributing to goal: ${goalName}`);
    // Implementation for contribution functionality
  };

  return (
    <Card className="w-full py-6 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#004a7c] to-[#00a9e0] text-white p-6">
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
                {["all", "In Progress", "Completed", "At Risk"].map((status) => (
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

      <CardContent className="p-0">
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
                currentGoals.map((goal, index) => (
                  <TableRow
                    key={index}
                    className={`border-t border-solid hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
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
                            onClick={() => handleContribute(goal.name)}
                            className="w-8 h-8 p-0 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                            title="Add Contribution"
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleView(goal.name)}
                          className="w-8 h-8 p-0 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(goal.name)}
                          className="w-8 h-8 p-0 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(goal.name)}
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
              <DollarSign className="w-4 h-4 mr-1" />
              Quick Contribute
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
  );
};
