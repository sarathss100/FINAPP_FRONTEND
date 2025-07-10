import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import { getToken } from '@/service/userService';

interface AdminMessage {
  id: string;
  text: string;
  sender: 'admin' | 'user';
  timestamp: Date;
}

interface ChatSession {
  userId: string;
  userName: string;
  messages: AdminMessage[];
  unreadCount: number;
  isActive: boolean;
}

interface AdminChatState {
  chatSessions: ChatSession[];
  selectedUserId: string | null;
  inputValue: string;
  isTyping: boolean;
  isConnected: boolean;
  connectionError: string | null;
  socket: typeof Socket | null;

  // Actions
  setInputValue: (value: string) => void;
  selectChatSession: (userId: string) => void;
  addMessageToSession: (userId: string, message: AdminMessage) => void;
  setIsTyping: (typing: boolean) => void;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  sendMessage: (message: string) => void;
  loadHistoryForUser: (userId: string, messages: AdminMessage[]) => void;
  loadAllChatSessions: (sessions: { userId: string; chats: { _id: string, userId: string, role: 'admin' | 'user', message: string, timestamp: string }[] }[]) => void;
}

export const useAdminChatStore = create<AdminChatState>((set, get) => ({
  chatSessions: [],
  selectedUserId: null,
  inputValue: '',
  isTyping: false,
  isConnected: false,
  connectionError: null,
  socket: null,

  setInputValue: (value: string) => set({ inputValue: value }),

  selectChatSession: (userId: string) => {
    set((state) => ({
      selectedUserId: userId,
      chatSessions: state.chatSessions.map((s) =>
        s.userId === userId ? { ...s, unreadCount: 0 } : s
      ),
    }));

    // Join user room and request specific user's history
    const socket = get().socket;
    socket?.emit('join_user_room', { userId });
  },

  addMessageToSession: (userId, message) =>
    set((state) => ({
      chatSessions: state.chatSessions.map((s) =>
        s.userId === userId
          ? {
              ...s,
              messages: [...s.messages, message],
              unreadCount:
                userId === state.selectedUserId || message.sender === 'admin'
                  ? s.unreadCount
                  : s.unreadCount + 1,
            }
          : s
      ),
    })),

  loadHistoryForUser: (userId, messages) =>
    set((state) => ({
      chatSessions: state.chatSessions.map((s) =>
        s.userId === userId ? { ...s, messages } : s
      ),
    })),

  loadAllChatSessions: (sessions) =>
    set(() => ({
      chatSessions: sessions.map((s) => ({
        userId: s.userId,
        userName: `User ${s.userId.slice(-4)}`,
        messages: s.chats.map((msg) => ({
          id: msg._id,
          text: msg.message,
          sender: msg.role,
          timestamp: new Date(msg.timestamp),
        })),
        unreadCount: 0,
        isActive: true,
      })),
    })),

  setIsTyping: (typing: boolean) => set({ isTyping: typing }),

  initializeSocket: async () => {
    try {
      const { socket } = get();
      if (socket) return;

      const socketUrl = process.env.NEXT_PUBLIC_ADMIN_SOCKET_URL || 'http://localhost:5000';
      const res = await getToken();
      if (!res.success) throw new Error('Token fetch failed');
      const accessToken = res.data.accessToken;

      const newSocket = io(socketUrl, {
        auth: { accessToken, clientType: 'admin' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      newSocket.on('connect', () => {
        set({ isConnected: true, connectionError: null });
        console.log('[Admin] Connected');
      });

      newSocket.on('disconnect', (reason: string) => {
        console.log('[Admin] Disconnected:', reason);
        set({ isConnected: false });
      });

      newSocket.on('connect_error', (error: Error) => {
        set({ isConnected: false, connectionError: error.message });
        console.error('Admin socket connection error:', error);
      });

      newSocket.on('auth_error', (error: string) => {
        set({ connectionError: error });
        console.error('Admin socket auth error:', error);
      });

      // Load all chat sessions when admin connects
      newSocket.on('get_all_chats', (history: { userId: string, chats: { _id: string, userId: string, message: string; role: 'user' | 'admin'; timestamp: string }[] }[]) => {
        get().loadAllChatSessions(history);
      });

      // Load specific user's chat history when joining their room
      newSocket.on('user_chat_history', (data: { userId: string, history: { _id: string, userId: string, message: string; role: 'user' | 'admin'; timestamp: string }[] }) => {
        const { userId, history } = data;
        
        const parsedMessages: AdminMessage[] = history.map((msg) => ({
          id: msg._id,
          text: msg.message,
          sender: msg.role,
          timestamp: new Date(msg.timestamp),
        }));

        get().loadHistoryForUser(userId, parsedMessages);
      });

      // Handle incoming user messages
      newSocket.on('user_message', (data: { message: string; id: string; userId: string }) => {
        get().addMessageToSession(data.userId, {
          id: data.id,
          text: data.message,
          sender: 'user',
          timestamp: new Date(),
        });
      });

      // Handle user typing indicators
      newSocket.on('user_typing', ({ userId }: { userId: string }) => {
        if (get().selectedUserId === userId) {
          set({ isTyping: true });
        }
      });

      newSocket.on('user_stop_typing', ({ userId }: { userId: string }) => {
        if (get().selectedUserId === userId) {
          set({ isTyping: false });
        }
      });

      // Handle new user connections
      newSocket.on('user_connected', ({ userId }: { userId: string }) => {
        console.log(`New user connected: ${userId}`);
        // Add user session if it doesn't exist
        set((state) => {
          const exists = state.chatSessions.find((s) => s.userId === userId);
          if (exists) return {};
          return {
            chatSessions: [
              ...state.chatSessions,
              {
                userId,
                userName: `User ${userId.slice(-4)}`,
                messages: [],
                unreadCount: 0,
                isActive: true,
              },
            ],
          };
        });
      });

      set({ socket: newSocket });
    } catch (error) {
      console.error('Admin socket initialization error:', error);
      set({ connectionError: 'Unable to connect. Please retry.' });
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (message: string) => {
    const { socket, isConnected, selectedUserId, addMessageToSession } = get();
    if (!message.trim() || !selectedUserId) return;

    const adminMsg: AdminMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'admin',
      timestamp: new Date(),
    };

    addMessageToSession(selectedUserId, adminMsg);
    set({ inputValue: '' });

    if (socket && isConnected) {
      socket.emit('admin_message', {
        message,
        userId: selectedUserId,
      });
    }
  },
}));