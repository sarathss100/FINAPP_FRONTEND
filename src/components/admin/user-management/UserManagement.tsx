"use client";
import {
  BanIcon,
  ClockIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from 'lucide-react';
import Button from '@/components/button';
import { Card, CardContent } from '@/components/Card';
import Input from '@/components/Input';
import { Select, SelectTrigger, SelectValue } from './select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import apiClient from '@/lib/apiClient';

export const UserManagementBody = () => {
  // State for users, loading, and error 
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Fetch data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/v1/admin/all-users');
        console.log(response.data)
        if (response.data.success) {
          setUsers(Object.values(response.data.data));
        } else {
          setError(response.data.data.message || "Failed to fetch users.");
        }
      } catch (error) {
        setError((err as Error).message || "An unexpected error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  console.log(users);

  // Pagination state
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Stats data
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      color: "text-[#004a7c]",
      bgColor: "bg-blue-100",
      icon: <UsersIcon className="w-[25px] h-5" />,
    },
    {
      title: "Active Users",
      value: "892",
      color: "text-[#00a9e0]",
      bgColor: "bg-emerald-100",
      icon: <UserCheckIcon className="w-[25px] h-5" />,
    },
    {
      title: "Pending Verification",
      value: "45",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      icon: <ClockIcon className="w-[25px] h-5" />,
    },
    {
      title: "Blocked Users",
      value: "12",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: <BanIcon className="w-[22.5px] h-5" />,
    },
  ];

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
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
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Top navigation */}

      {/* User search and filters */}
      <Card className="mb-6 shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Input
                className="h-[42px] pl-10 text-base font-normal"
                placeholder="SearchIcon users..."
              />
              <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-[129px] h-[42px] border">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
              </Select>

              <Select>
                <SelectTrigger className="w-[111px] h-[42px] border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
              </Select>

              <Button className="h-[42px] bg-[#004a7c] text-white">
                <PlusIcon className="mr-2 h-4 w-3.5" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card className="mb-6 overflow-hidden shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
                <TableHead className="w-[150px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                    ID    
                </TableHead>
                <TableHead className="w-[344px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                    Name
                </TableHead>
                <TableHead className="w-[150px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                    Group
                </TableHead>
                <TableHead className="w-[150px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                    Phone
                </TableHead>
                <TableHead className="w-[172px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                    Status
                </TableHead>
              {/* <TableHead className="w-[218px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                Last Active
              </TableHead> */}
                <TableHead className="w-[252px] h-10 text-xs font-medium text-gray-500 tracking-[0.60px]">
                    Actions
                </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user, index) => (
              <TableRow key={user.id} className="h-[72px]">
                <TableCell className="py-4 text-center align-middle">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-base">{1000 + index}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-normal text-base">
                  {`${user.firstName} ${user.lastName}`}
                </TableCell>
                <TableCell className="font-normal text-base">
<<<<<<< HEAD
<<<<<<< Updated upstream
                  {user.group}
=======
                  {user.role}
>>>>>>> Stashed changes
=======
                  {user.status ? 'Active' : 'Blocked'}
>>>>>>> 0fd848f687a8d4b149ffe43fdf9eb02a4b3ce39b
                </TableCell>
                <TableCell className="font-normal text-base">
                  {user.phoneNumber}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`
                      rounded-full px-2 py-1 font-medium text-xs
                      ${
                        user.status ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {user.status ? 'Acitve': 'Blocked'}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-sm text-gray-500">
                  {user.lastActive}
                </TableCell> */}
                <TableCell>
                  <div className="flex gap-2">
                    <Button className="h-8 w-8 rounded-lg">
                      <EditIcon className="h-4 w-4 text-black" />
                    </Button>
                    <Button className="h-8 w-8 rounded-lg">
                      <Trash2Icon className="h-4 w-3.5 bg-black" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 leading-[14px]">
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold leading-6 mt-2 ${stat.color}`}
                  >
                    {users.length}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
