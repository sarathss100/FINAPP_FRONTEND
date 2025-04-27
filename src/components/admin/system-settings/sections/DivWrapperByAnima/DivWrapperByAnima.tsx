import React from "react";
import Button from '@/components/base/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/base/Card';
import { Switch } from '@/components/base/switch';

const DivWrapperByAnima = function () {
  // Preference items data for mapping
  const preferenceItems = [
    {
      id: "automatic-updates",
      title: "Automatic Updates",
      description: "Enable automatic system updates",
      enabled: true,
    },
    {
      id: "email-notifications",
      title: "Email Notifications",
      description: "Receive system notification emails",
      enabled: false,
    },
  ];

  return (
    <Card className="w-full max-w-[1120px] mx-auto shadow-[0px_1px_2px_#0000000d] rounded-xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl text-[#004a7c] font-semibold font-['Roboto',Helvetica]">
          General Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* System Information Section */}
        <div className="pb-6 border-b">
          <h3 className="font-medium text-gray-700 text-base font-['Roboto',Helvetica] mb-2.5">
            System Information
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex">
              <span className="font-normal text-gray-600 text-base font-['Roboto',Helvetica]">
                Version:
              </span>
              <span className="font-normal text-[#00a9e0] text-base font-['Roboto',Helvetica] ml-2">
                2.1.0
              </span>
            </div>
            <div className="flex sm:ml-auto">
              <span className="font-normal text-gray-600 text-base font-['Roboto',Helvetica]">
                Last Updated:
              </span>
              <span className="font-normal text-black text-base font-['Roboto',Helvetica] ml-2">
                Jan 15, 2025
              </span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="font-medium text-gray-700 text-base font-['Roboto',Helvetica] mb-2.5">
            Preferences
          </h3>
          <div className="space-y-4">
            {preferenceItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
              >
                <div>
                  <h4 className="font-normal text-gray-700 text-base font-['Roboto',Helvetica]">
                    {item.title}
                  </h4>
                  <p className="font-normal text-gray-500 text-sm font-['Roboto',Helvetica]">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={item.enabled}
                  className={item.enabled ? "bg-[#00a9e0]" : "bg-gray-200"}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6 border-t">
        <Button className="bg-[#004a7c] hover:bg-[#003a62] text-white font-normal font-['Roboto',Helvetica]">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DivWrapperByAnima;
