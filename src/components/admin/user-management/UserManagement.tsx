"use client";
import {
  BanIcon,
  BellIcon,
  ClockIcon,
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import React, { useState } from "react";
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

export const UserManagementBody = () => {
  // User data for the table
  const allUsers = [
    {
      id: 1,
      name: "John Doe",
      group: "User",
      phone: "1234567890",
      status: true,
    },
    {
      id: 2,
      name: "John Doe",
      group: "User",
      phone: "1234567890",
      status: true,
      },
      {
      id: 3,
      name: "John Doe",
      group: "User",
      phone: "1234567890",
      status: true,
      },
      {
      id: 4,
      name: "John Doe",
      group: "User",
      phone: "1234567890",
      status: true,
      },
      {
      id: 5,
      name: "John Doe",
      group: "User",
      phone: "1234567890",
      status: false,
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);

  // Get current users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

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
            {currentUsers.map((user) => (
              <TableRow key={user.id} className="h-[72px]">
                <TableCell className="py-4 text-center align-middle">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-base">{user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-normal text-base">
                  {user.name}
                </TableCell>
                <TableCell className="font-normal text-base">
<<<<<<< Updated upstream
                  {user.group}
=======
                  {user.role}
>>>>>>> Stashed changes
                </TableCell>
                <TableCell className="font-normal text-base">
                  {user.phone}
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
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, allUsers.length)} of {allUsers.length} entries
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
