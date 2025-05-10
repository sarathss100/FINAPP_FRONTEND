import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/base/select';
import { Switch } from '@/components/base/switch';

const DivByAnima = function () {
  // Configuration dat

  const systemStatuses = [
    { name: "Database: Healthy", status: "healthy" },
    { name: "API: Operational", status: "healthy" },
  ];

  return (
    <div className="w-full space-y-6 py-8 px-8">
      {/* General Configuration */}
      <Card className="shadow-[0px_1px_2px_#0000000d]">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
            General Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                Application Name
              </label>
              <Input
                className="h-[42px] font-['Roboto',Helvetica]"
                defaultValue="Finance Manager Pro"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                Default Currency
              </label>
              <Select>
                <SelectTrigger className="h-[39px] font-['Roboto',Helvetica]">
                  <SelectValue placeholder="USD ($)" />
                </SelectTrigger>
                <SelectContent>
                  <div className="font-['Roboto',Helvetica]">INR ($)</div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                Time Zone
              </label>
              <Select>
                <SelectTrigger className="h-[39px] font-['Roboto',Helvetica]">
                  <SelectValue placeholder="UTC (GMT+0)" />
                </SelectTrigger>
                <SelectContent>
                  <div className="font-['Roboto',Helvetica]">UTC (GMT+0)</div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-['Roboto',Helvetica]">
                Application Version
              </label>
              <Select>
                <SelectTrigger className="h-[39px] font-['Roboto',Helvetica]">
                  <SelectValue placeholder="Version: 2.0.1" />
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="shadow-[0px_1px_2px_#0000000d]">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="text-base font-medium font-['Roboto',Helvetica]">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500 font-['Roboto',Helvetica]">
                  Enable 2FA for additional security
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Management */}
      <Card className="shadow-[0px_1px_2px_#0000000d]">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
            API Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium font-['Roboto',Helvetica]">
                API Keys
              </h3>
              <Button className="bg-[#00a9e0] hover:bg-[#00a9e0]/90 text-white font-['Roboto',Helvetica]">
                Add New Key
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-['Inter',Helvetica]">
                sk_live_51ABC123XYZ...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card className="shadow-[0px_1px_2px_#0000000d]">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold text-[#004a7c] font-['Roboto',Helvetica]">
            System Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-base font-medium mb-4 font-['Roboto',Helvetica]">
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemStatuses.map((status, index) => (
                  <div key={index} className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-sm font-['Roboto',Helvetica]">
                        {status.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-[#00a9e0] hover:bg-[#00a9e0]/90 text-white font-['Roboto',Helvetica]">
              Run System Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DivByAnima;
