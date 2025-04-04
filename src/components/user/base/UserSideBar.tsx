"use client"
import {
  LayoutDashboardIcon,
  BarChart3Icon,
  TrendingDownIcon,
  WalletIcon,
  TargetIcon,
  PiggyBankIcon,
  LineChartIcon,
  ShieldIcon,
  ReceiptIcon,
  BellIcon,
  FileTextIcon,
  SettingsIcon,
  LogOutIcon
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/stores/store';
import { signout } from '@/service/authenticationService';

export const UserSideBar = () => {
  const router = useRouter();
  const pathName = usePathname();
  // State to toggle sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Zustand store actions 
  const { logout } = useUserStore();

  // Function to handle sign out
  const handleSignOut = async function () {
    // Send logout request to backend 
    await signout();

    // Reset Zustand state
    logout();

    // Redirect to login page
    window.location.replace('/login');
  }

  // Navigation items data for easy mapping
  const navItems = [
    {
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      label: "Dashboard",
      route: "/dashboard"
    },
    {
      icon: (
        <Image src="/general-ledger.png" alt="General ledger" height={16} width={16} />
      ),
      label: "Transactions",
      route: "/transactions"
    }, 
    {
      icon: <BarChart3Icon className="h-4 w-4" />,
      label: "Income Analysis",
      route: "/income-analysis"
    },
    {
      icon: <TrendingDownIcon className="h-4 w-4" />,
      label: "Expense Analysis",
      route: "/expense-analysis"
    }, 
    {
      icon: <WalletIcon className="h-4 w-4" />,
      label: "Debt Analysis",
      route: "/debt-analysis"
    }, 
    {
      icon: <TargetIcon className="h-4 w-4" />,
      label: "Goal Management",
      route: "/goal-management"
    },
    {
      icon: <PiggyBankIcon className="h-4 w-4" />,
      label: "Accounts",
      route: "/accounts"
    },
    {
      icon: <LineChartIcon className="h-4 w-4" />,
      label: "Investments",
      route: "/investments"
    }, 
    {
      icon: <ShieldIcon className="h-4 w-4" />,
      label: "Insurances",
      route: "/insurances"
    },
    {
      icon: <ReceiptIcon className="h-4 w-4" />,
      label: "Tax Overview",
      route: "/tax-overview"
    },
    {
      icon: <BellIcon className="h-4 w-4" />,
      label: "Notifications",
      route: "/notifications"
    }, 
    {
      icon: <FileTextIcon className="h-4 w-4" />,
      label: "Custom Reports",
      route: "/custom-reports"
    },
    {
      icon: <SettingsIcon className="h-4 w-4" />,
      label: "Profile & Settings",
      route: "/profile-settings"
    },
    {
      icon: (
        <Image src="/monarch-butterfly.png" alt="Monarch butterfly" height={16} width={16} />
      ),
      label: "Butterfly Effect",
      route: "/butterfly-effect"
    }
  ];

  return (
    <aside
      className={`flex flex-col h-screen bg-[#004a7c] transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
    
      {/* Header Section */}
      <div className="p-6">
        <h1
          className={`font-normal text-white text-2xl leading-6 font-['Poppins',Helvetica] ${
            !isSidebarOpen && "hidden"
          }`}
        >
          FinDash 
        </h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-3 px-6 flex flex-col space-y-4 overflow-hidden">
        {navItems.map((item, index) => {
          const isActive = pathName === item.route
          return (
            <button
              key={index}
              onClick={() => router.push(item.route)}
              className={`flex items-center rounded-lg h-12 ${!isSidebarOpen ? "px-2" : 'px-3'} ${ isActive
                ? "bg-[#00a9e0]"
                : "hover:bg-[#005d99] transition-colors"
                }`}
            >
              <span className="flex items-center justify-center text-white">
                {item.icon}
              </span>
              <span
                className={`ml-2 font-['Poppins',Helvetica] font-normal text-base ${ isActive ? "text-white" : "text-white"
                  } ${!isSidebarOpen && "hidden"}`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className='mt-auto flex items-center rounded-lg h-12 pl-8 hover:bg-[#005d99] tansition-colors'
      >
        <span className='flex items-center justify-center text-white'>
          <LogOutIcon/>
        </span>
        <span
          className={`ml-2 font-['Poppins', Helvetica] font-normal text-base text-white ${!isSidebarOpen && 'hidden'}`}
        >
          Sign Out
        </span>
      </button>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute bottom-2 left-1 bg-[#00a9e0] rounded-full hover:bg-[#008dc4] transition-colors"
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
      </aside>
  );
};
