import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { getToken } from './userService';

interface ServerMessage {
    type: string;
    payload: unknown;
}

// Fix: Proper Socket type declaration
let socket: typeof Socket | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners = new Map<string, Array<(data: any) => void>>();

export const connectWebSocket = async function(clientType: 'user' | 'admin' = 'user') {
    if (socket?.connected) {
        console.log('WebSocket already connected with ID:', socket.id);
        // Emit connection status to any new listeners
        emitToListeners('socket_connected', { socketId: socket.id });
        return socket;
    }

    // Disconnect existing socket if any (but not connected)
    if (socket) {
        console.log('Cleaning up existing disconnected socket');
        socket.disconnect();
        socket = null;
    }

    try {
        const res = await getToken();
        if (!res.success) throw new Error(`Token fetch failed`);

        const accessToken = res.data.accessToken;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000/';

        socket = io(socketUrl, {
            auth: {
                accessToken,
                clientType,
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
        });

        // Handle connection
        socket.on('connect', () => {
            console.log(`Socket.IO: Connected to server with ID: ${socket?.id}`);
            // Emit connection status to listeners
            emitToListeners('socket_connected', { socketId: socket?.id });
        });
        
        // Handle disconnect
        socket.on('disconnect', (reason: string) => {
            console.log(`Socket.IO: Disconnected:`, reason);
            // Emit disconnect status to listeners
            emitToListeners('socket_disconnected', reason);
        });

        // Handle connection errors
        socket.on('connect_error', (error: Error) => {
            console.error(`Socket.IO: Connection error:`, error);
            // Emit connection error to listeners
            emitToListeners('socket_connect_error', { message: error.message });
        });

        // Handle reconnection
        socket.on('reconnect', (attemptNumber: number) => {
            console.log('Reconnected after', attemptNumber, 'attempts');
            emitToListeners('socket_reconnected', { attemptNumber });
        });

        // Handle reconnection errors
        socket.on('reconnect_error', (error: Error) => {
            console.error('Reconnection error:', error);
            emitToListeners('socket_reconnect_error', { message: error.message });
        });

        // Handle reconnection failure
        socket.on('reconnect_failed', () => {
            console.error('Reconnection failed');
            emitToListeners('socket_reconnect_failed', {});
        });

        // Global message handler for server events
        socket.on('event_from_server', (message: ServerMessage) => {
            console.log('Received server event:', message.type, message.payload);
            emitToListeners(message.type, message.payload);
        });

        // Direct event handlers for backward compatibility
        socket.on('connection_confirmed', (data: unknown) => {
            console.log('Connection confirmed:', data);
            emitToListeners('connection_confirmed', data);
        });

        socket.on('chat_history', (data: unknown) => {
            console.log('Chat history received:', data);
            emitToListeners('chat_history', data);
        });

        socket.on('user_message', (data: unknown) => {
            console.log('User message received:', data);
            emitToListeners('user_message', data);
        });

        socket.on('admin_typing', (data: unknown) => {
            emitToListeners('admin_typing', data);
        });

        socket.on('bot_stop_typing', (data: unknown) => {
            emitToListeners('bot_stop_typing', data);
        });

        // Add error handling for auth failures
        socket.on('auth_error', (error: unknown) => {
            console.error('Authentication error:', error);
            emitToListeners('auth_error', error);
        });

        return socket;

    } catch (error) {
        console.error(`Failed to initialize WebSocket:`, error);
        // Emit connection error to listeners
        emitToListeners('socket_connect_error', { 
            message: error instanceof Error ? error.message : 'Failed to initialize WebSocket'
        });
        throw error;
    }
};

// Helper function to emit events to all listeners
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emitToListeners(eventType: string, data: any) {
    if (listeners.has(eventType)) {
        listeners.get(eventType)?.forEach((callback) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in listener for ${eventType}:`, error);
            }
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onMessage = function(eventType: string, callback: (data: any) => void) {
    if (!listeners.has(eventType)) {
        listeners.set(eventType, []);
    }
    listeners.get(eventType)?.push(callback);
    
    // Return cleanup function
    return () => offMessage(eventType, callback);
};

// Remove a specific listener
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const offMessage = function(eventType: string, callback: (data: any) => void) {
    if (listeners.has(eventType)) {
        const eventListeners = listeners.get(eventType)!;
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
            eventListeners.splice(index, 1);
        }
    }
};

// Remove all listeners for an event type
export const removeAllListeners = function(eventType: string) {
    listeners.delete(eventType);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMessage = function(eventType: string, payload: any){
    if (!socket) {
        console.warn(`Socket not initialized. Cannot send "${eventType}"`);
        return false;
    }

    if (!socket.connected) {
        console.warn(`Socket not connected. Cannot send "${eventType}"`);
        return false;
    }

    try {
        // Handle direct events (backward compatibility)
        if (['test_connection', 'user_message'].includes(eventType)) {
            socket.emit(eventType, payload);
        } else {
            // Use the centralized event structure
            socket.emit('event_from_client', {
                type: eventType,
                payload,
            });
        }
        return true;
    } catch (error) {
        console.error(`Error sending message "${eventType}":`, error);
        return false;
    }
};

export const disconnectWebSocket = function() {
    if (socket) {
        socket.disconnect();
        socket = null;
        // Clear all listeners when disconnecting
        listeners.clear();
    }
};

// Utility functions
export const isSocketConnected = function(): boolean {
    return socket?.connected || false;
};

export const getSocketId = function(): string | undefined {
    return socket?.id;
};

// Add connection status getter
export const getSocket = function(): typeof Socket | null {
    return socket;
};