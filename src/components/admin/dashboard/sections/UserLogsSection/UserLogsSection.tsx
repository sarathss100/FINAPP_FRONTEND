import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Select, SelectTrigger, SelectValue } from '@/components/base/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';

// Define log data for mapping
const logData = [
  {
    timestamp: "2025-01-15 14:23:01",
    event: "User Login",
    user: "568795568",
    ipAddress: "192.168.1.1",
    status: "Success",
  },
  {
    timestamp: "2025-01-15 14:20:45",
    event: "Password Change",
    user: "956783669",
    ipAddress: "192.168.1.45",
    status: "Success",
  },
  {
    timestamp: "2025-01-15 14:15:30",
    event: "Failed Login Attempt",
    user: "955487568",
    ipAddress: "192.168.1.87",
    status: "Failed",
  },
  {
    timestamp: "2025-01-15 14:10:15",
    event: "System Update",
    user: "59756682",
    ipAddress: "internal",
    status: "Complete",
  },
  {
    timestamp: "2025-01-15 14:05:22",
    event: "File Download",
    user: "7856986654",
    ipAddress: "192.168.1.23",
    status: "Success",
  },
];

// Define pagination data
const paginationItems = [1, 2, 3];

const UserLogsSection = function () {
  return (
    <Card className="w-full rounded-xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
            User Logs
          </h2>

          <div className="flex gap-4">
            <Input
              className="w-[217px] h-[42px] text-base font-normal text-[#adaebc] font-['Roboto',Helvetica]"
              placeholder="Search logs..."
            />

            <Select>
              <SelectTrigger className="w-[125px] h-[42px] font-normal text-black text-base font-['Roboto',Helvetica]">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead className="font-bold text-black text-base font-['Roboto',Helvetica]">
                  Timestamp
                </TableHead>
                <TableHead className="font-bold text-black text-base font-['Roboto',Helvetica]">
                  Event
                </TableHead>
                <TableHead className="font-bold text-black text-base font-['Roboto',Helvetica]">
                  User
                </TableHead>
                <TableHead className="font-bold text-black text-base font-['Roboto',Helvetica]">
                  IP Address
                </TableHead>
                <TableHead className="font-bold text-black text-base font-['Roboto',Helvetica]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logData.map((log, index) => (
                <TableRow key={index} className="border-b border-solid">
                  <TableCell className="font-normal text-black text-base font-['Roboto',Helvetica]">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-normal text-black text-base font-['Roboto',Helvetica]">
                    {log.event}
                  </TableCell>
                  <TableCell className="font-normal text-black text-base font-['Roboto',Helvetica]">
                    {log.user}
                  </TableCell>
                  <TableCell className="font-normal text-black text-base font-['Roboto',Helvetica]">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`font-normal text-base ${
                        log.status === "Success"
                          ? "bg-emerald-100 text-emerald-600"
                          : log.status === "Failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-gray-600 text-base font-normal font-['Roboto',Helvetica]">
            Showing 5 of 125 entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-9 h-[34px] rounded-lg"
            >
              <ChevronLeftIcon className="h-4 w-2.5" />
            </Button>

            {paginationItems.map((item, index) => (
              <Button
                key={index}
                variant={item === 1 ? "primary" : "outline"}
                className={`w-[35px] h-[34px] rounded-lg ${item === 1 ? "bg-[#00a9e0]" : ""}`}
              >
                <span
                  className={`text-base font-normal font-['Roboto',Helvetica] ${item === 1 ? "text-white" : "text-black"}`}
                >
                  {item}
                </span>
              </Button>
            ))}

            <Button
              variant="outline"
              className="w-9 h-[34px] rounded-lg"
            >
              <ChevronRightIcon className="h-4 w-2.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLogsSection;
