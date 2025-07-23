import io, { Socket } from "socket.io-client";

let adminSocket: typeof Socket | null = null;

export const getAdminSocket = function(accessToken: string): typeof Socket {
    if (!adminSocket) {
        const socketUrl = process.env.NEXT_PUBLIC_ADMIN_SOCKET_URL || 'http://localhost:5000/admin';

        adminSocket = io(socketUrl, {
        auth: { accessToken, clientType: 'admin' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      console.log(`New Admin Socket Connected`);
    }

    return adminSocket;
};

export const disconnectAdminSocket = function() {
    if (adminSocket) {
        adminSocket.disconnect();
        adminSocket = null;
        console.log(`Admin Socket Disconnected`);
    }
};