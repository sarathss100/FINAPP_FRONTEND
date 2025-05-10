"use client";
import {
  AlertTriangleIcon,
  CheckCircle,
  SearchIcon,
  ServerIcon,
  UsersIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { toast } from 'react-toastify';
import { getAllUsers, getNewRegistrationCount, getSystemHealthStatus, getSystemMetrics } from '@/service/adminService';
import { IHealthStatus, SystemMetrics } from '@/types/IAdminUserDetails';

const AdminSystemOverviewBody = function () {
  const [error, setError] = React.useState<boolean>(false);
  const [systemHealthDetails, setSystemHealthDetails] = useState<IHealthStatus>({
    status: 'healthy',
    score: 0,
    details: '',
    checks: [],
    lastChecked: new Date()
  });
  const [totalActiveUser, setTotalActiveUser] = useState(0);
  const [newRegistration, setNewRegistration] = useState(0);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    ramUsage: 0,
    diskUsage: 0
  });

  useEffect(() => {
    async function getData() {
      try {
        const response = await getAllUsers();
        const userCount = Object.keys(response.data).length;
        setTotalActiveUser(userCount);
      } catch (error) {
        toast.error((error as Error).message || `Failed to fetch the data`);
        setError(true);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getSystemHealthStatus();
        setSystemHealthDetails(response.data.healthStatus);
      } catch (error) {
        toast.error((error as Error).message || `Failed to get the system health`);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getNewRegistrationCount();
        setNewRegistration(response.data.newRegistrationCount);
      } catch (error) {
        toast.error((error as Error).message || `Failed to get the new registration count`);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getSystemMetrics();
        setSystemMetrics(response.data.usageStatics);
      } catch (error) {
        toast.error((error as Error).message || `Failed to get the new registration count`);
      }
    }
    getData();
  }, []);


  return (
    <main className="w-full max-w-[1184px] mx-auto font-sans">
      <header className="p-8 flex justify-between items-center">
        <div className="relative w-[373px]">
          <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 h-[42px] text-base"
            placeholder="Search..."
          />
        </div>
      </header>

      <section className="px-8">
        <div className="mb-14">
          <h1 className="font-bold text-2xl text-[#004a7c] leading-normal">
            System Overview
          </h1>
          <div className="flex items-center">
            <p className="text-gray-500 text-base mt-2 leading-relaxed">
              Welcome back, Admin
            </p>
            {error && (
              <div className="ml-4 flex items-center text-red-500 text-sm">
                <AlertTriangleIcon className="w-4 h-4 mr-1" />
                <span>Some data failed to load. Please refresh the page.</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md rounded-xl border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 text-base font-medium">
                  Active Users
                </span>
                <UsersIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="font-bold text-3xl text-[#004a7c] mb-6">
                {totalActiveUser}
              </h2>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 text-base font-medium">
                  New Registrations
                </span>
                <UsersIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="font-bold text-3xl text-[#004a7c] mb-6">
                {newRegistration}
              </h2>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 text-base font-medium">
                  System Health
                </span>
                <ServerIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="font-bold text-3xl text-[#004a7c] mb-6">
                {systemHealthDetails.score}
              </h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                {systemHealthDetails.status}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md rounded-xl border-0">
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-[#004a7c]">
                System Health Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {systemHealthDetails.checks && systemHealthDetails?.checks.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div>
                      <p className="text-gray-700 font-medium leading-relaxed">
                        {activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl border-0">
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-[#004a7c]">
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">                  
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="flex items-center">
                    {Number(systemMetrics.ramUsage) > 50 ? (
                      <div className="flex items-center">
                        <AlertTriangleIcon className="w-5 h-5 text-red-700 mr-3" />
                        <div>
                          <p className="text-red-700 font-medium text-base">
                            High RAM Usage
                          </p>
                          <p className="text-red-500 text-sm mt-1">
                            {systemMetrics.ramUsage.toFixed(2)} % capacity used
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-700 mr-3" />
                        <div>
                          <p className="text-green-700 font-medium text-base">Normal RAM Usage</p>
                          <p className="text-green-500 text-sm mt-1">
                            {systemMetrics.ramUsage.toFixed(2)} % capacity used
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-center">
                    {Number(systemMetrics.diskUsage) > 50 ? (
                      <div className="flex items-center">
                        <AlertTriangleIcon className="w-5 h-5 text-red-700 mr-3" />
                        <div>
                          <p className="text-red-700 font-medium text-base">
                            High CPU Usage
                          </p>
                          <p className="text-red-500 text-sm mt-1">
                            {systemMetrics.diskUsage.toFixed(2)} % capacity used
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-700 mr-3" />
                        <div>
                          <p className="text-green-700 font-medium text-base">Normal CPU Usage</p>
                          <p className="text-green-500 text-sm mt-1">
                            {systemMetrics.diskUsage.toFixed(2)} % capacity used
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default AdminSystemOverviewBody;
