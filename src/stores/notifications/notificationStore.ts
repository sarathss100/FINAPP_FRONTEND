import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import { getToken } from '@/service/userService';
import { INotification } from '@/types/INotification';
import { getUserSocket } from '@/lib/userSocket';

interface NotificationState {
  // Chat UI state
  notifications: INotification[];
  isConnected: boolean;
  connectionError: string | null;
  
  // Socket instance
  socket: typeof Socket | null;
  
  // Actions
  setIsConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  initializeSocket: () => void;
  markNotificationReaded: (notificationId: string) => void;
  markAllNotificationsAsSeen: () => void;
  disconnectSocket: () => void;
  clearMessages: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  isConnected: false,
  connectionError: null,
  socket: null,

  // Actions
  setIsConnected: (connected: boolean) => set({ isConnected: connected }),

  setConnectionError: (error: string | null) => set({ connectionError: error }),

  initializeSocket: async () => {
    try {
      const res = await getToken();
      if (!res.success) throw new Error(`Token fetch failed`);
      const accessToken = res.data.accessToken;
  
      const newSocket = getUserSocket(accessToken, 'notification');

      if (!newSocket.hasListeners('connect')) {
        newSocket.on('connect', () => {
          console.log('Connected to notification server');
          set({ isConnected: true, connectionError: null });
        });

        interface DisconnectReason {
          type: string;
          description?: string;
        }

        newSocket.on('disconnect', (reason: DisconnectReason) => {
          console.log('Disconnected:', reason);
          set({ isConnected: false });
        });

        interface ConnectError {
          message: string;
          [key: string]: unknown;
        }

        newSocket.on('connect_error', (error: ConnectError) => {
          console.error('Connection error:', error.message);
          set({ connectionError: `Connection failed: ${error.message}` });
        });

        newSocket.emit('request_notifications');

        newSocket.on('notifications', (notifications: INotification[]) => {
          set({ notifications });
        });

        newSocket.on('notification_marked_read', (notificationId: string) => {
            set((state) => ({
              notifications: state.notifications.map((n) =>
                n._id === notificationId ? { ...n, is_read: true } : n
              ),
            }));
        });

        newSocket.on('all_notifications_marked_read', () => {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          }));
        });

        newSocket.on('new_notification', () => {
          newSocket.emit('request_notifications');
        });
      }

      // Finalize
      set({ socket: newSocket });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
      set({
        connectionError: 'Unable to fetch token. Please login again.',
      });
    }
  },

  clearMessages: () => set({ notifications: [] }),

  markNotificationReaded: (notificationId: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('mark_notification_as_read', { notificationId });
    } else {
      console.log(`No socket connection found`);
    }
  },

  markAllNotificationsAsSeen: () => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('mark_all_notification_as_read');
    } else {
      console.log(`No socket connection found`);
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
      console.log('Socket disconnected');
    }
  },
}));