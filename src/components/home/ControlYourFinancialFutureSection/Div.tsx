import { BellIcon, LockIcon, SearchIcon, ShieldIcon } from "lucide-react";
import React from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";

export const Div = (): JSX.Element => {
  // Data for form fields
  const userInfo = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  };

  // Connected accounts data
  const connectedAccounts = [
    {
      name: "Google",
      status: "Connected",
      icon: "/frame-3.svg",
      connected: true,
    },
    {
      name: "Apple",
      status: "Not connected",
      icon: "/frame-2.svg",
      connected: false,
    },
  ];

  // Family members data
  const familyMembers = [
    {
      title: "Show Accounts",
      description: "Add on accounts",
      action: "Show Related Acconts",
    },
    {
      title: "Remove add on Account",
      description: "Remoces Add On Accounts",
      action: "Delete Account",
    },
  ];

  // Account management data
  const accountManagement = [
    {
      title: "Back up Data",
      description: "Export Data",
      action: "Export / Import",
    },
    {
      title: "Delete Account",
      description: "Destroy Data",
      action: "Delete Account",
    },
  ];

  return (
    <main className="max-w-[1184px] mx-auto p-8 font-sans">
      {/* Header with search and profile */}
      <header className="flex justify-between items-center mb-6">
        <div className="relative w-[373px]">
          <div className="absolute left-3 top-3">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            className="pl-10 h-[42px] font-normal text-base"
            placeholder="SearchIcon..."
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <BellIcon className="h-4 w-3.5" />
            <span className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full" />
          </div>
          <Avatar className="h-10 w-10">
            <img src="..//img.png" alt="User profile" />
          </Avatar>
        </div>
      </header>

      {/* Page title */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-[#004a7c] mb-2">
          Profile &amp; Settings
        </h1>
        <p className="text-gray-500 text-base">
          Manage your account settings and preferences
        </p>
      </section>

      {/* Account Settings Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                defaultValue={userInfo.firstName}
                className="h-[42px] font-normal text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                defaultValue={userInfo.lastName}
                className="h-[42px] font-normal text-base"
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              defaultValue={userInfo.email}
              className="h-[42px] font-normal text-base"
            />
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              defaultValue={userInfo.phone}
              className="h-[42px] font-normal text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <LockIcon className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium text-base">Password</p>
                  <p className="text-sm text-gray-500">
                    Last changed 3 months ago
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="text-[#00a9e0]">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldIcon className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium text-base">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={account.icon}
                    alt={account.name}
                    className="h-5 w-5 mt-1"
                  />
                  <div>
                    <p className="font-medium text-base">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.status}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className={
                    account.connected ? "text-red-500" : "text-[#004a7c]"
                  }
                >
                  {account.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family Members Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Family memebers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-base">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className={
                    item.action.includes("Delete")
                      ? "text-red-500"
                      : "text-[#004a7c]"
                  }
                >
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Management Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#004a7c]">
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accountManagement.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-base">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500">
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
