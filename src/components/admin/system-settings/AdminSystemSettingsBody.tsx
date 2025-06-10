"use client";
import { Shield, Database, Key, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Switch } from '@/components/base/switch';
import { getUserProfileDetails, toggleUserTwoFactorAuthentication } from '@/service/userService';
import { toast } from 'react-toastify';

const AdminSystemSettingsBody = function () {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfileDetails();
        if (response.success) {
          const userData = response.data;
          setIsTwoFactorEnabled(userData.is2FA);
        } 
      } catch (error) {
        toast.error((error as Error).message || "An error occurred while fetching user data");
      }
    };
    fetchUserData();
  }, []);

  const handleToggle2FA = async function () {
    try {
      setIsLoading(true);
      const data = await toggleUserTwoFactorAuthentication();
      setIsTwoFactorEnabled(data.data.isToggled);
      toast.success(data.message);
    } catch (error) {
      toast.error((error as Error).message || "Failed to toggle 2FA");
      // Revert the state if there was an error
      setIsTwoFactorEnabled(prev => !prev);
    } finally {
      setIsLoading(false);
    }
  }

  const systemStatuses = [
    { name: "Database: Healthy", status: "healthy", icon: <Database className="w-4 h-4 text-emerald-600" /> },
    { name: "API: Operational", status: "healthy", icon: <Key className="w-4 h-4 text-emerald-600" /> },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1184px] mx-auto py-8 gap-8 bg-gray-50">

      {/* Main content sections */}
      <div className="w-full space-y-6 px-6">
        {/* General Configuration */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-[#004a7c] to-[#0072bc] text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2 font-['Roboto',Helvetica]">
              <div className="p-1 bg-white/20 rounded-md">
                <AlertCircle className="w-5 h-5" />
              </div>
              General Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                  Application Name
                </label>
                <Input
                  className="h-[42px] font-['Roboto',Helvetica] border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  defaultValue="FinApp"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                  Default Currency
                </label>
                <Input
                  className="h-[42px] font-['Roboto',Helvetica] border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  defaultValue="INR (₹)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                  Time Zone
                </label>
                <Input
                  className="h-[42px] font-['Roboto',Helvetica] border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  defaultValue={timeZone}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                  Application Version
                </label>
                <Input
                  className="h-[42px] font-['Roboto',Helvetica] border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  defaultValue="Version: 2.0.1"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-[#004a7c] to-[#0072bc] text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2 font-['Roboto',Helvetica]">
              <div className="p-1 bg-white/20 rounded-md">
                <Shield className="w-5 h-5" />
              </div>
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <h3 className="text-base font-medium font-['Roboto',Helvetica] text-gray-800">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-500 font-['Roboto',Helvetica] mt-1">
                    Enable 2FA for additional security
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    isTwoFactorEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Switch
                    checked={isTwoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                    disabled={isLoading}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Management */}
        {/* <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-[#004a7c] to-[#0072bc] text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2 font-['Roboto',Helvetica]">
              <div className="p-1 bg-white/20 rounded-md">
                <Key className="w-5 h-5" />
              </div>
              API Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="border rounded-lg p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium font-['Roboto',Helvetica] text-gray-800">
                  API Keys
                </h3>
                <Button className="bg-[#00a9e0] hover:bg-[#008bba] text-white font-['Roboto',Helvetica] px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                  <Key className="w-4 h-4" />
                  Add New Key
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-mono tracking-wide text-gray-700">
                    sk_live_51ABC123XYZ...
                  </p>
                  <Button className="text-xs bg-transparent hover:bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-300">
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* System Maintenance */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-[#004a7c] to-[#0072bc] text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2 font-['Roboto',Helvetica]">
              <div className="p-1 bg-white/20 rounded-md">
                <Database className="w-5 h-5" />
              </div>
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="space-y-5">
              <div className="border rounded-lg p-5 bg-gray-50">
                <h3 className="text-base font-medium mb-4 font-['Roboto',Helvetica] text-gray-800">
                  System Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemStatuses.map((status, index) => (
                    <div key={index} className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full mr-3 flex items-center justify-center">
                          {status.icon}
                        </div>
                        <span className="text-sm font-medium text-emerald-800 font-['Roboto',Helvetica]">
                          {status.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <Button className="w-full bg-[#00a9e0] hover:bg-[#008bba] text-white font-['Roboto',Helvetica] py-3 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm">
                <AlertCircle className="w-5 h-5" />
                Run System Diagnostics
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSystemSettingsBody;
