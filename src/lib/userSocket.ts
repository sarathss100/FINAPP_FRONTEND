import io, { Socket } from "socket.io-client";

let userSocket: typeof Socket | null = null;

export const getUserSocket = function(accessToken: string, namespace: string): typeof Socket {
    if (!userSocket) {
        const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000/';
        const socketUrl = baseUrl + namespace;

        userSocket = io(socketUrl, {
        auth: { accessToken, clientType: 'user' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      console.log(`New User ${namespace} Socket Connected`);
    }

    return userSocket;
};

export const disconnectUserSocket = function() {
    if (userSocket) {
        userSocket.disconnect();
        userSocket = null;
        console.log(`User Socket Disconnected`);
    }
};