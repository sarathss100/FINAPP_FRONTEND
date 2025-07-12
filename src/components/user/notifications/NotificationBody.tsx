"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Image from 'next/image';
import UserHeader from '../base/Header';
import { INotification, NOTIFICATION_TYPES } from "@/types/INotification";
import { useNotificationStore } from "@/stores/notifications/notificationStore";
import { markAllNotificationsAsSeen, markNotificationReaded } from "@/service/notificationService";

// Enhanced category mapping with read/unread categories
const categories = [
  {
    id: "all",
    title: "All Notifications",
    description: "View all notifications",
    count: 0,
    color: "blue",
    icon: "/account_icon.svg",
    gradient: "from-blue-50 to-blue-100/50",
    borderColor: "border-blue-500",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "unread",
    title: "Unread",
    description: "New notifications requiring attention",
    count: 0,
    color: "red",
    icon: "/tick.svg",
    gradient: "from-red-50 to-red-100/50",
    borderColor: "border-red-500",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    id: "read",
    title: "Read",
    description: "Previously viewed notifications",
    count: 0,
    color: "green",
    icon: "/double_tick.svg",
    gradient: "from-green-50 to-green-100/50",
    borderColor: "border-green-500",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: "DebtPaymentAlert",
    title: "Debt Payment Alerts",
    description: "Upcoming and overdue debt payments",
    count: 0,
    color: "red",
    icon: "/bill_icon.svg",
    gradient: "from-red-50 to-red-100/50",
    borderColor: "border-red-500",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    id: "GoalPaymentAlert",
    title: "Goal Payment Alerts",
    description: "Savings goal payment reminders",
    count: 0,
    color: "emerald",
    icon: "/goal_icon.svg",
    gradient: "from-emerald-50 to-emerald-100/50",
    borderColor: "border-emerald-500",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "InsurancePaymentAlert",
    title: "Insurance Payment Alerts",
    description: "Insurance premium reminders",
    count: 0,
    color: "amber",
    icon: "/account_icon.svg",
    gradient: "from-amber-50 to-amber-100/50",
    borderColor: "border-amber-500",
    badgeColor: "bg-amber-100 text-amber-700",
  },
];

const NotificationBody = function () {
  const notifications = useNotificationStore((state) => state.notifications);
  const initializeSocket = useNotificationStore((state) => state.initializeSocket);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const calculateCategoryCounts = useCallback((notificationList: INotification[]) => {
    const counts: { [key: string]: number } = {
      all: notificationList.length,
      read: notificationList.filter(n => n.is_read).length,
      unread: notificationList.filter(n => !n.is_read).length,
    };
    
    // Count by notification type
    NOTIFICATION_TYPES.forEach(type => {
      counts[type] = notificationList.filter(n => n.type === type).length;
    });
    
    setCategoryCounts(counts);
  }, []);

  const handleStore = useCallback(() => {
    initializeSocket();
    calculateCategoryCounts(notifications);
    setLoading(false);
  }, [initializeSocket, calculateCategoryCounts, notifications]);

  useEffect(() => {
    handleStore();
  }, [handleStore]);

  // interface UpdateCategoryCountsAction {
  //   notification: INotification;
  //   action: 'add' | 'remove';
  // }

  // const updateCategoryCounts = (
  //   notification: INotification,
  //   action: UpdateCategoryCountsAction['action']
  // ): void => {
  //   setCategoryCounts((prev) => {
  //     const newCounts = { ...prev };
      
  //     // Update read/unread counts
  //     if (action === 'add') {
  //       if (!notification.is_read) {
  //         newCounts.unread = (newCounts.unread || 0) + 1;
  //       } else {
  //         newCounts.read = (newCounts.read || 0) + 1;
  //       }
  //     } else {
  //       if (!notification.is_read) {
  //         newCounts.unread = Math.max(0, (newCounts.unread || 0) - 1);
  //         newCounts.read = (newCounts.read || 0) + 1;
  //       }
  //     }
      
  //     return newCounts;
  //   });
  // };

  const markAsRead = async (notificationId: string) => {
    try {
      console.log(notificationId);
      await markNotificationReaded(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsSeen();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DebtPaymentAlert':
        return '/bill_icon.svg';
      case 'GoalPaymentAlert':
        return '/goal_icon.svg';
      case 'InsurancePaymentAlert':
        return '/account_icon.svg';
      default:
        return '/notification_icon.svg';
    }
  };

  const getNotificationBackground = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white border border-gray-100 shadow-sm';
    
    switch (type) {
      case 'DebtPaymentAlert':
        return 'bg-gradient-to-r from-red-50 to-red-100/30 border-l-4 border-l-red-500 shadow-md';
      case 'GoalPaymentAlert':
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100/30 border-l-4 border-l-emerald-500 shadow-md';
      case 'InsurancePaymentAlert':
        return 'bg-gradient-to-r from-amber-50 to-amber-100/30 border-l-4 border-l-amber-500 shadow-md';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100/30 shadow-md';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationKey = (notification: INotification, index: number) => {
    return `${notification.user_id}-${notification.type}-${notification.createdAt}-${index}`;
  };

  // Filter notifications based on selected category
  const getFilteredNotifications = () => {
    switch (selectedCategory) {
      case 'all':
        return notifications;
      case 'read':
        return notifications.filter(n => n.is_read);
      case 'unread':
        return notifications.filter(n => !n.is_read);
      default:
        return notifications.filter(n => n.type === selectedCategory);
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const totalUnreadCount = categoryCounts.unread || 0;

  // Group filtered notifications by type for display
  const groupedNotifications = NOTIFICATION_TYPES.reduce((acc: Record<typeof NOTIFICATION_TYPES[number], INotification[]>, type) => {
    acc[type] = filteredNotifications.filter(n => n.type === type);
    return acc;
  }, {} as Record<typeof NOTIFICATION_TYPES[number], INotification[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004a7c]"></div>
        <span className="ml-3 text-[#004a7c] font-['Poppins',Helvetica]">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start relative min-h-screen">
      <div className="relative w-full max-w-[1440px] bg-gradient-to-br from-neutral-50 to-neutral-100 py-6 px-6">
        <UserHeader />
        
        {/* Enhanced Header with gradient and better spacing */}
        <header className="w-full mb-8">
          <Card className="shadow-lg bg-gradient-to-r from-white to-blue-50/30 border-0">
            <CardContent className="flex justify-between items-center p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#004a7c] to-[#00a9e0] rounded-full flex items-center justify-center">
                  <Image
                    alt="Notifications"
                    src="/account_icon.svg"
                    height={24}
                    width={24}
                    className="filter invert brightness-0 contrast-100"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <div>
                  <h1 className="font-['Poppins',Helvetica] font-semibold text-[#004a7c] text-2xl mb-1">
                    Notifications
                  </h1>
                  <p className="font-['Poppins',Helvetica] text-gray-600 text-sm">
                    {totalUnreadCount > 0 ? `${totalUnreadCount} unread notification${totalUnreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="text-[#004a7c] bg-white/80 hover:bg-white border border-gray-200 hover:border-[#004a7c] transition-all duration-200 px-4 py-2 rounded-lg shadow-sm"
                  onClick={markAllAsRead}
                  disabled={totalUnreadCount === 0}
                >
                  <Image
                    className="mr-2"
                    alt="Mark as read icon"
                    src="/double_tick.svg"
                    height={16}
                    width={16}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span className="font-['Poppins',Helvetica] text-sm font-medium">
                    Mark all as read
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Enhanced Category Cards with read/unread filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`border-l-4 ${category.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-r ${category.gradient} ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                    <Image
                      alt={category.title}
                      src={category.icon}
                      height={20}
                      width={20}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>
                  <h3 className="font-['Poppins',Helvetica] font-semibold text-[#004a7c] text-sm mb-1">
                    {category.title}
                  </h3>
                  <p className="font-['Poppins',Helvetica] text-gray-600 text-xs mb-2">
                    {category.description}
                  </p>
                  <Badge className={`${category.badgeColor} rounded-full px-2 py-1 font-semibold text-xs`}>
                    {categoryCounts[category.id] || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Filter Indicator */}
        {selectedCategory !== 'all' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Image
                alt="Filter"
                src="/filter-svgrepo-com.svg"
                height={16}
                width={16}
              />
              <span className="font-['Poppins',Helvetica] text-sm text-blue-700">
                Showing: {categories.find(c => c.id === selectedCategory)?.title || selectedCategory}
              </span>
              <Button
                className="ml-auto text-sm"
                onClick={() => setSelectedCategory('all')}
              >
                Clear filter
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Notifications Content */}
        <Card className="shadow-lg bg-white border-0">
          <CardContent className="p-6">
            {/* Show notifications grouped by type when filtering by read/unread/all */}
            {(['all', 'read', 'unread'].includes(selectedCategory)) ? (
              NOTIFICATION_TYPES.map((type) => {
                const categoryNotifications = groupedNotifications[type] || [];
                const categoryInfo = categories.find(c => c.id === type);
                
                if (categoryNotifications.length === 0) return null;

                return (
                  <div key={type} className="mb-8 last:mb-0">
                    <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#004a7c] to-[#00a9e0] rounded-full flex items-center justify-center mr-3">
                        <Image
                          alt={`${type} icon`}
                          src={getNotificationIcon(type)}
                          width={16}
                          height={16}
                          className="filter invert brightness-0 contrast-100"
                          style={{ width: '16px', height: '16px' }}
                        />
                      </div>
                      <h2 className="font-['Poppins',Helvetica] font-semibold text-[#004a7c] text-lg">
                        {categoryInfo?.title || type}
                      </h2>
                      <Badge className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1">
                        {categoryNotifications.length}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {categoryNotifications.map((notification, index) => (
                        <div
                          key={getNotificationKey(notification, index)}
                          className={`rounded-xl p-5 flex justify-between items-center transition-all duration-200 hover:shadow-md ${getNotificationBackground(notification.type, notification.is_read)}`}
                        >
                          <div className="flex items-start flex-1">
                            <div className="flex items-center justify-center mr-4 mt-1">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <Image
                                  alt={notification.title}
                                  src={getNotificationIcon(notification.type)}
                                  height={20}
                                  width={20}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-['Poppins',Helvetica] font-semibold text-[#004a7c] text-base leading-tight">
                                    {notification.title}
                                  </h3>
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 ml-4 font-medium">
                                  {formatTimestamp(notification.createdAt || '')}
                                </span>
                              </div>
                              <p className="font-['Poppins',Helvetica] text-gray-600 text-sm leading-relaxed mb-2">
                                {notification.message}
                              </p>
                              {notification.meta && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                  <p className="text-xs text-gray-500">
                                    {typeof notification.meta === 'string' 
                                      ? notification.meta 
                                      : JSON.stringify(notification.meta)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.is_read && (
                              <Button
                                className="text-[#00a9e0] bg-white hover:bg-[#00a9e0] hover:text-white border border-[#00a9e0] transition-all duration-200 text-sm px-3 py-1 rounded-lg"
                                onClick={() => markAsRead(notification._id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // Show notifications for specific type filter
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={getNotificationKey(notification, index)}
                    className={`rounded-xl p-5 flex justify-between items-center transition-all duration-200 hover:shadow-md ${getNotificationBackground(notification.type, notification.is_read)}`}
                  >
                    <div className="flex items-start flex-1">
                      <div className="flex items-center justify-center mr-4 mt-1">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Image
                            alt={notification.title}
                            src={getNotificationIcon(notification.type)}
                            height={20}
                            width={20}
                            style={{ width: '20px', height: '20px' }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-['Poppins',Helvetica] font-semibold text-[#004a7c] text-base leading-tight">
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-4 font-medium">
                            {formatTimestamp(notification.createdAt || '')}
                          </span>
                        </div>
                        <p className="font-['Poppins',Helvetica] text-gray-600 text-sm leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        {notification.meta && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">
                              {typeof notification.meta === 'string' 
                                ? notification.meta 
                                : JSON.stringify(notification.meta)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.is_read && (
                        <Button
                          className="text-[#00a9e0] bg-white hover:bg-[#00a9e0] hover:text-white border border-[#00a9e0] transition-all duration-200 text-sm px-3 py-1 rounded-lg"
                          onClick={() => markAsRead(notification._id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    alt="No notifications"
                    src="/account_icon.svg"
                    height={32}
                    width={32}
                    className="opacity-50"
                    style={{ width: '32px', height: '32px' }}
                  />
                </div>
                <h3 className="font-['Poppins',Helvetica] font-semibold text-gray-600 text-lg mb-2">
                  {selectedCategory === 'all' ? 'No notifications yet' : 
                   selectedCategory === 'read' ? 'No read notifications' :
                   selectedCategory === 'unread' ? 'No unread notifications' :
                   `No ${categories.find(c => c.id === selectedCategory)?.title || selectedCategory} notifications`}
                </h3>
                <p className="text-gray-500 text-sm">
                  {selectedCategory === 'all' ? "You'll see your notifications here when they arrive" :
                   selectedCategory === 'read' ? "Notifications you've read will appear here" :
                   selectedCategory === 'unread' ? "New notifications will appear here" :
                   `${categories.find(c => c.id === selectedCategory)?.title || selectedCategory} notifications will appear here`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationBody;