import { SearchIcon } from "lucide-react";
import React from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Progress } from '@/components/base/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/Table';
import Image from 'next/image';

// System performance data
const systemPerformanceData = [
  { title: "CPU Usage", value: "65%", progressValue: 65 },
  { title: "Memory Usage", value: "82%", progressValue: 82 },
  { title: "Storage Usage", value: "45%", progressValue: 45 },
  { title: "Network Usage", value: "78%", progressValue: 78 },
];

// User engagement data
const userEngagementData = [
  { title: "Active Users", value: "2847" },
  { title: "Total Sessions", value: "12589" },
  { title: "Avg. Session Duration", value: "24m 32s" },
  { title: "Bounce Rate", value: "23%" },
];

// Error logs data
const errorLogsData = [
  {
    timestamp: "2024-01-20 14:23:01",
    errorType: "API Error",
    message: "Failed to fetch user data",
    status: "Error",
  },
  {
    timestamp: "2024-01-20 14:20:45",
    errorType: "Database Error",
    message: "Connection timeout",
    status: "Error",
  },
  {
    timestamp: "2024-01-20 14:15:30",
    errorType: "Authentication",
    message: "Invalid credentials",
    status: "Error",
  },
];

// Custom reports data
const customReportsData = [
  {
    title: "User Activity Report",
    description: "Daily user engagement metrics",
    schedule: "Daily",
  },
  {
    title: "Performance Report",
    description: "System performance metrics",
    schedule: "Weekly",
  },
  {
    title: "Error Analysis",
    description: "Detailed error tracking report",
    schedule: "Monthly",
  },
];

// Audit trail data
const auditTrailData = [
  {
    timestamp: "2024-01-20 15:30:00",
    action: "Report Generated",
    user: "735678668",
    ipAddress: "192.168.1.100",
  },
  {
    timestamp: "2024-01-20 15:15:00",
    action: "Settings Updated",
    user: "758697897",
    ipAddress: "192.168.1.101",
  },
  {
    timestamp: "2024-01-20 15:00:00",
    action: "User Login",
    user: "45678967",
    ipAddress: "192.168.1.102",
  },
];

const AdminAnalyticsBody = function () {
  return (
    <div className="w-full min-h-screen bg-white">
      <header className="flex justify-between items-center p-8">
        <div className="relative w-[373px]">
          <Input
            className="pl-10 h-[42px] text-base font-normal text-[#adaebc] font-['Poppins',Helvetica]"
            placeholder="SearchIcon..."
          />
          <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Image alt="Notification" src="/frame-2.svg" width={14} height={16} />
            <div className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full" />
          </div>

          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: "url(../img.png)" }}
          />
        </div>
      </header>

      <main className="bg-neutral-100 p-6 min-h-screen">
        {/* Dashboard Header */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-4">
              <h1 className="font-bold text-2xl text-[#004a7c] font-['Roboto',Helvetica]">
                Analytics &amp; Reports Dashboard
              </h1>
              <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90 text-white">
                <Image className="mr-3" alt="Export" src="/frame.svg" width={16} height={16} />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
              System Performance
            </CardTitle>
            <div className="bg-[#d9d9d9] rounded-lg px-3 py-2 text-base font-normal font-['Roboto',Helvetica]">
              Last 24 Hours
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemPerformanceData.map((item, index) => (
                <div
                  key={index}
                  className="bg-neutral-100 rounded-lg p-4 relative"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-base font-normal font-['Roboto',Helvetica]">
                      {item.title}
                    </span>
                    <Image
                      alt="Info"
                      src={`/frame-${index === 0 ? 4 : index === 1 ? 3 : index === 2 ? 1 : 5}.svg`}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="font-bold text-2xl text-[#111111] mb-4 font-['Roboto',Helvetica]">
                    {item.value}
                  </div>
                  <Progress
                    value={item.progressValue}
                    className="h-2 bg-gray-200"
                    // indicatorClassName="bg-[#00a9e0]"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userEngagementData.map((item, index) => (
                <div key={index} className="bg-neutral-100 rounded-lg p-4">
                  <div className="text-gray-600 text-base font-normal mb-2 font-['Roboto',Helvetica]">
                    {item.title}
                  </div>
                  <div className="font-bold text-2xl text-[#111111] font-['Roboto',Helvetica]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Logs */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
              Error Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    Timestamp
                  </TableHead>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    Error Type
                  </TableHead>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    Message
                  </TableHead>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogsData.map((error, index) => (
                  <TableRow key={index} className="border-b border-gray-200">
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {error.timestamp}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {error.errorType}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {error.message}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-600 font-normal text-base rounded font-['Roboto',Helvetica]"
                      >
                        {error.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Custom Reports */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
              Custom Reports
            </CardTitle>
            <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90 text-white">
              Create New Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customReportsData.map((report, index) => (
                <div
                  key={index}
                  className="border border-solid rounded-lg p-4 flex flex-col h-[130px] justify-between"
                >
                  <div>
                    <h3 className="font-bold text-[#111111] text-base mb-2 font-['Roboto',Helvetica]">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-base font-normal font-['Roboto',Helvetica]">
                      {report.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00a9e0] text-base font-normal font-['Roboto',Helvetica]">
                      Scheduled: {report.schedule}
                    </span>
                    <span className="text-gray-600 text-base font-normal font-['Roboto',Helvetica] cursor-pointer">
                      Edit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
              Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    Timestamp
                  </TableHead>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    Action
                  </TableHead>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    User
                  </TableHead>
                  <TableHead className="font-bold text-[#111111] text-base font-['Roboto',Helvetica]">
                    IP Address
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditTrailData.map((audit, index) => (
                  <TableRow key={index} className="border-b border-gray-200">
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {audit.timestamp}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {audit.action}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {audit.user}
                    </TableCell>
                    <TableCell className="py-4 font-normal text-[#111111] text-base font-['Roboto',Helvetica]">
                      {audit.ipAddress}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAnalyticsBody;
