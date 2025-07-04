import { create } from 'zustand';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { getToken } from '@/service/userService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatState {
  // Chat UI state
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  isConnected: boolean;
  connectionError: string | null;
  
  // Socket instance
  socket: typeof Socket | null;
  
  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  setInputValue: (value: string) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (typing: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  testConnection: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  isOpen: false,
  isMinimized: false,
  messages: [
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ],
  inputValue: '',
  isTyping: false,
  isConnected: false,
  connectionError: null,
  socket: null,

  // Actions
  openChat: () => {
    set({ isOpen: true });
    const { socket, initializeSocket } = get();
    if (!socket) {
      initializeSocket();
    }
  },

  closeChat: () => set({ isOpen: false }),

  toggleChat: () => {
    const { isOpen, openChat, closeChat } = get();
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  },

  minimizeChat: () => set({ isMinimized: true }),

  maximizeChat: () => set({ isMinimized: false }),

  setInputValue: (value: string) => set({ inputValue: value }),

  addMessage: (message: Message) => 
    set((state) => ({ messages: [...state.messages, message] })),

  setIsTyping: (typing: boolean) => set({ isTyping: typing }),

  setIsConnected: (connected: boolean) => set({ isConnected: connected }),

  setConnectionError: (error: string | null) => set({ connectionError: error }),

  initializeSocket: async() => {
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
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to chat server');
        console.log('Socket ID:', newSocket.id);
        console.log('Transports:', newSocket.io.opts.transports);
        set({ isConnected: true, connectionError: null });
        
        // Test the connection
        newSocket.emit('test_connection');
      });

      newSocket.on('disconnect', (reason: string) => {
      console.log('❌ Disconnected from chat server, reason:', reason);
      set({ isConnected: false });
      
      // Log different disconnect reasons for debugging
        switch (reason) {
          case 'io server disconnect':
            console.log('🔴 Server disconnected the client');
            break;
          case 'io client disconnect':
            console.log('🔴 Client disconnected');
            break;
          case 'ping timeout':
            console.log('🔴 Connection timed out');
            break;
          case 'transport close':
            console.log('🔴 Transport closed');
            break;
          case 'transport error':
            console.log('🔴 Transport error');
            break;
          default:
            console.log('🔴 Unknown disconnect reason:', reason);
        }
      });

      interface SocketConnectError {
        message: string;
        type?: string;
        description?: string;
      }

      newSocket.on('connect_error', (error: SocketConnectError) => {
        console.error('❌ Connection error:', error);
        console.error('Error type:', error.type);
        console.error('Error description:', error.description);
        set({ 
          isConnected: false, 
          connectionError: `Connection failed: ${error.message}` 
        });
      });

      newSocket.on('reconnect', (attemptNumber: number) => {
        console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      });

      interface SocketReconnectError {
        message: string;
        type?: string;
        description?: string;
      }

      newSocket.on('reconnect_error', (error: SocketReconnectError) => {
        console.error('🔄 Reconnection error:', error);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('🔄 Reconnection failed');
        set({ connectionError: 'Failed to reconnect to server' });
      });

      // Test connection response
    interface ConnectionConfirmedData {
      socketId: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }

    newSocket.on('connection_confirmed', (data: ConnectionConfirmedData) => {
      console.log('✅ Connection test successful:', data);
      get().addMessage({
      id: Date.now().toString(),
      text: `Connected successfully! Socket ID: ${data.socketId}`,
      sender: 'bot',
      timestamp: new Date(),
      });
    });

    newSocket.on('bot_response', (data: { message: string; id: string }) => {
      console.log('📨 Received bot response:', data);
      const { setIsTyping, addMessage } = get();
      setIsTyping(false);
      addMessage({
        id: data.id || Date.now().toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
      });
    });

    newSocket.on('bot_typing', () => {
      console.log('⌨️ Bot is typing...');
      set({ isTyping: true });
    });

    newSocket.on('bot_stop_typing', () => {
      console.log('⌨️ Bot stopped typing');
      set({ isTyping: false });
    });

    set({ socket: newSocket });

    } catch (error) {
      console.error('❌ Failed to initialize socket:', error);
      set({
        connectionError: 'Unable to fetch token. Please login again.',
      });
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      console.log('🔌 Disconnecting socket...');
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  testConnection: () => {
    const { socket } = get();
    if (socket && socket.connected) {
      console.log('🧪 Testing connection...');
      socket.emit('test_connection');
    } else {
      console.log('🚫 No socket connection to test');
    }
  },

  sendMessage: (message: string) => {
    const { socket, isConnected, addMessage } = get();
    
    if (message.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    set({ inputValue: '' });

    // Send message to backend via Socket.IO
    if (socket && isConnected) {
      console.log('📤 Sending message:', message);
      socket.emit('user_message', {
        message: message,
        userId: socket.id,
      });
    } else {
      console.log('🚫 No socket connection, showing fallback message');
      // Fallback: simulate bot response if no socket connection
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
        });
      }, 1000);
    }
  },

  clearMessages: () => set({ messages: [] }),
}));