import { create } from 'zustand';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { getToken } from '@/service/userService';
import { INotification } from '@/types/INotification';

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
      const { socket } = get();
      if (socket) {
        console.log('Socket already exists, skipping initialization');
        return;
      }

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000/';
      console.log('Attempting to connect to:', socketUrl);

      const res = await getToken();
      if (!res.success) throw new Error(`Token fetch failed`);

      const accessToken = res.data.accessToken;

      const newSocket = io(socketUrl, {
        auth: {
          accessToken,
        },
        transports: ['websocket'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      // --- Socket Event Handlers ---
      newSocket.on('connect', () => {
        console.log('✅ Connected to notification server');
        set({ isConnected: true, connectionError: null });
      });

      interface DisconnectReason {
        type: string;
        description?: string;
      }

      newSocket.on('disconnect', (reason: DisconnectReason) => {
        console.log('❌ Disconnected:', reason);
        set({ isConnected: false });
      });

      interface ConnectError {
        message: string;
        [key: string]: unknown;
      }

      newSocket.on('connect_error', (error: ConnectError) => {
        console.error('❌ Connection error:', error.message);
        set({ connectionError: `Connection failed: ${error.message}` });
      });

      newSocket.emit('request_notifications');

      newSocket.on('notifications', (notifications: INotification[]) => {
        console.log('📬 notifications received:', notifications);
        set({ notifications });
      });

      newSocket.on('notification_marked_read', (notificationId: string) => {
          console.log('🔔 Notification marked read:', notificationId);
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n._id === notificationId ? { ...n, is_read: true } : n
            ),
          }));
      });

      newSocket.on('all_notifications_marked_read', () => {
        console.log('✅ All notifications marked read');
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        }));
      });

      // Finalize
      set({ socket: newSocket });

    } catch (error) {
      console.error('❌ Failed to initialize socket:', error);
      set({
        connectionError: 'Unable to fetch token. Please login again.',
      });
    }
  },

  clearMessages: () => set({ notifications: [] }),

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
      console.log('🔌 Socket disconnected');
    }
  },
}));