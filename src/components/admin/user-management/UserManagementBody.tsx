"use client";
import {
  BanIcon,
  ClockIcon,
  SearchIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Select, SelectTrigger, SelectValue } from '@/components/base/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/base/Table";
import { toast } from 'react-toastify';
import IAdminUserDetails from '@/types/IAdminUserDetails';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MUIButton
} from "@mui/material";
import { getAllUsers, toggleUserStats } from '@/service/adminService';

export const UserManagementBody = () => {
  // State for users, loading, and error 
  const [users, setUsers] = useState<IAdminUserDetails['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGroup, setFilterGroup] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Increased from 2 for better user experience

  // State for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<{ userId: string, currentStatus: boolean } | null>(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(Object.values(response.data));
        } else {
          setError(response.message || `Failed to fetch users.`);
        }
      } catch (error) {
        setError((error as Error).message || "An unexpected error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          user.phoneNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "active" && user.status) ||
                          (filterStatus === "blocked" && !user.status);
    
    const matchesGroup = filterGroup === "all" || user.role === filterGroup;
    
    return matchesSearch && matchesStatus && matchesGroup;
  });

  // Get stats for cards
  const activeUsers = users.filter(user => user.status).length;
  const blockedUsers = users.filter(user => !user.status).length;
  // Assuming pending verification is not implemented yet, keeping it at 0

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle block/unblock confirmation modal
  const openConfirmationModal = (userId: string, currentStatus: boolean) => {
    setUserToToggle({ userId, currentStatus });
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setUserToToggle(null);
    setIsModalOpen(false);
  };

  // Function to block/unblock a user
  const handleBlockUnblock = async () => {
    if (!userToToggle) return; 
    
    try {
      const { userId, currentStatus } = userToToggle;
      const newStatus = !currentStatus; // Toggle status

      // Send API request to toggle user status
      await toggleUserStats(userId, newStatus);

      // Update the users state locally
      setUsers((prevUsers) => 
        prevUsers.map((user) => 
          user.userId === userId ? { ...user, status: newStatus } : user
        )
      );

      // Close the modal and show success toast;
      closeConfirmationModal();
      toast.success(`User ${newStatus ? "unblocked" : "blocked"} successfully.`);
    } catch (error) {
      console.error(`Error toggling user status:`, (error as Error).message);
      toast.error(`Failed to toggle user status. Please try again`);
    }
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
          <p className="text-gray-700 font-medium">Loading users data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 mx-auto mb-4 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-6">
      {/* Confirmation Modal using Material-UI */}
      <Dialog 
        open={isModalOpen} 
        onClose={closeConfirmationModal}
        PaperProps={{
          style: { borderRadius: '12px', padding: '8px' }
        }}
      >
        <DialogTitle className="text-xl font-semibold">
          {userToToggle?.currentStatus ? 
            "Block User" : 
            "Unblock User"
          }
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-600 mt-1">
            Are you sure you want to {userToToggle?.currentStatus ? "block" : "unblock"} this user? 
            {userToToggle?.currentStatus ? 
              " This will prevent them from accessing the system." : 
              " This will restore their access to the system."
            }
          </p>
        </DialogContent>
        <DialogActions>
          <MUIButton 
            onClick={closeConfirmationModal} 
            style={{ 
              textTransform: 'none', 
              fontWeight: 500,
              color: '#6B7280'
            }}
          >
            Cancel
          </MUIButton>
          <MUIButton 
            onClick={handleBlockUnblock} 
            variant="contained" 
            style={{ 
              backgroundColor: userToToggle?.currentStatus ? '#EF4444' : '#10B981',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px'
            }}
          >
            {userToToggle?.currentStatus ? "Block User" : "Unblock User"}
          </MUIButton>
        </DialogActions>
      </Dialog>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">View, search and manage user accounts</p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Users
                </p>
                <p className="text-3xl font-bold mt-2 text-blue-800">
                  {users.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      
        <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Active Users
                </p>
                <p className="text-3xl font-bold mt-2 text-emerald-600">
                  {activeUsers}
                </p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <UserCheckIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      
        <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Pending Verification
                </p>
                <p className="text-3xl font-bold mt-2 text-amber-600">
                  0
                </p>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      
        <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Blocked Users
                </p>
                <p className="text-3xl font-bold mt-2 text-red-600">
                  {blockedUsers}
                </p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <BanIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User search and filters */}
      <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                className="h-11 pl-10 text-base font-normal rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search users by name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset page when search changes
                }}
              />
              <SearchIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              <Select 
                value={filterGroup}
                onValueChange={(value) => {
                  setFilterGroup(value);
                  setCurrentPage(1); // Reset page when filter changes
                }}
              >
                <SelectTrigger className="w-40 h-11 border border-gray-300 rounded-lg">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
              </Select>

              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1); // Reset page when filter changes
                }}
              >
                <SelectTrigger className="w-40 h-11 border border-gray-300 rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
              </Select>

              <Button 
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                onClick={() => {
                  setSearchTerm("");
                  setFilterGroup("all");
                  setFilterStatus("all");
                  setCurrentPage(1);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl overflow-hidden">
        {filteredUsers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-24 h-12 text-xs font-semibold text-gray-600 tracking-wider uppercase pl-6">
                      ID    
                    </TableHead>
                    <TableHead className="w-64 h-12 text-xs font-semibold text-gray-600 tracking-wider uppercase">
                      Name
                    </TableHead>
                    <TableHead className="w-32 h-12 text-xs font-semibold text-gray-600 tracking-wider uppercase">
                      Group
                    </TableHead>
                    <TableHead className="w-40 h-12 text-xs font-semibold text-gray-600 tracking-wider uppercase">
                      Phone
                    </TableHead>
                    <TableHead className="w-32 h-12 text-xs font-semibold text-gray-600 tracking-wider uppercase">
                      Status
                    </TableHead>
                    <TableHead className="w-36 h-12 text-xs font-semibold text-gray-600 tracking-wider uppercase text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user, index) => (
                    <TableRow 
                      key={user.userId} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="font-medium text-gray-900">#{1000 + indexOfFirstUser + index}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-blue-700">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {`${user.firstName} ${user.lastName}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <div className={`
                          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${user.status 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-red-100 text-red-800"
                          }
                        `}>
                          {user.status ? '● Active' : '● Blocked'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${user.status 
                              ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" 
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200"
                            }
                          `}
                          onClick={() => openConfirmationModal(user.userId, user.status)}
                        >
                          {user.status ? "Block" : "Unblock"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                Showing <span className="font-medium mx-1">{indexOfFirstUser + 1}</span> to <span className="font-medium mx-1">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-medium mx-1">{filteredUsers.length}</span> users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-lg text-sm transition-colors"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {/* Logic to show appropriate page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current
                    let pageToShow;
                    if (totalPages <= 5) {
                      // If total pages are 5 or less, show all pages
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      // If near start, show first 5 pages
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If near end, show last 5 pages
                      pageToShow = totalPages - 4 + i;
                    } else {
                      // Show 2 pages before and after current page
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageToShow}
                        size="sm"
                        className={`
                          w-8 h-8 rounded-lg text-sm font-medium
                          ${currentPage === pageToShow
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }
                        `}
                        onClick={() => setCurrentPage(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-lg text-sm transition-colors"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500 max-w-md mb-4">
              No users match your current search criteria. Try adjusting your filters or search term.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              onClick={() => {
                setSearchTerm("");
                setFilterGroup("all");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
