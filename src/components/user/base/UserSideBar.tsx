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
  BellIcon,
  SettingsIcon,
  LogOutIcon,
  FileTextIcon,
  CrownIcon,
  XIcon
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
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // Zustand store actions 
  const { logout } = useUserStore();

  const isSubscribed = useUserStore((state) => state.isSubscribed);

  // Define which routes are accessible to free users
  const freeRoutes = [
    "/dashboard",
    "/transactions", 
    "/income-analysis",
    "/expense-analysis",
    "/profile-settings",
    "/butterfly-effect",
    "/subscription",
  ];

  // Function to handle sign out
  const handleSignOut = async function () {
    // Send logout request to backend 
    await signout();

    // Reset Zustand state
    logout();

    // Redirect to login page
    window.location.replace('/login');
  }

  // Function to handle navigation with subscription check
  interface RouteHandler {
    route: string;
  }

  const handleNavigation = ({ route }: RouteHandler): void => {
    if (!isSubscribed && !freeRoutes.includes(route)) {
      setShowSubscribeModal(true);
    } else {
      router.push(route);
    }
  };

  // Navigation items data for easy mapping
  const navItems = [
    {
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      label: "Overview",
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
      label: "Inflow Analysis",
      route: "/income-analysis"
    },
    {
      icon: <TrendingDownIcon className="h-4 w-4" />,
      label: "Outflow Analysis",
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
      icon: <BellIcon className="h-4 w-4" />,
      label: "Notifications",
      route: "/notifications"
    }, 
    {
      icon: (
        <Image src="/monarch-butterfly.png" alt="Monarch butterfly" height={16} width={16} />
      ),
      label: "Future Projection",
      route: "/butterfly-effect"
    },
    {
      icon: <FileTextIcon className="h-4 w-4" />,
      label: "Subscription",
      route: "/subscription"
    },
    {
      icon: <SettingsIcon className="h-4 w-4" />,
      label: "Profile & Settings",
      route: "/profile-settings"
    },
  ];

  // Subscribe Modal Component
  const SubscribeModal = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Premium Feature</h2>
          <button
            onClick={() => setShowSubscribeModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <CrownIcon className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            This feature is available for premium subscribers only. Upgrade your plan to access advanced analytics and management tools.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowSubscribeModal(false);
              router.push('/subscription');
            }}
            className="flex-1 bg-[#00a9e0] text-white py-2 px-4 rounded-lg hover:bg-[#008dc4] transition-colors"
          >
            Go to Subscription
          </button>
          <button
            onClick={() => setShowSubscribeModal(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
            const isActive = pathName === item.route;
            const isRestricted = !isSubscribed && !freeRoutes.includes(item.route);
            
            return (
              <button
                key={index}
                onClick={() => handleNavigation({ route: item.route })}
                className={`flex items-center rounded-lg h-12 ${!isSidebarOpen ? "px-2" : 'px-3'} relative ${
                  isActive
                    ? "bg-[#00a9e0]"
                    : "hover:bg-[#005d99] transition-colors"
                }`}
              >
                <span className="flex items-center justify-center text-white">
                  {item.icon}
                </span>
                <span
                  className={`ml-2 font-['Poppins',Helvetica] font-normal text-base ${
                    isActive ? "text-white" : "text-white"
                  } ${!isSidebarOpen && "hidden"}`}
                >
                  {item.label}
                </span>
                {/* Premium indicator */}
                {isRestricted && isSidebarOpen && (
                  <CrownIcon className="h-4 w-4 text-yellow-400 ml-auto" />
                )}
              </button>
            );
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

      {/* Subscribe Modal */}
      {showSubscribeModal && <SubscribeModal />}
    </>
  );
};