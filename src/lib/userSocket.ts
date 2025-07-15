import io, { Socket } from "socket.io-client";

interface SocketMap {
    [namespace: string]: typeof Socket | null;
}

let userSockets: SocketMap = {};

export const getUserSocket = function(accessToken: string, namespace: string): typeof Socket {
    if (userSockets[namespace]) {
        return userSockets[namespace];
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000/';
    const socketUrl = `${baseUrl}${namespace}`;

    const newSocket = io(socketUrl, {
        auth: { accessToken, clientType: 'user' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 20000,
    });

    userSockets[namespace] = newSocket;

    return newSocket;
};

export const disconnectUserSocket = function(namespace?: string) {
    if (namespace) {
        const socket = userSockets[namespace];

        if (socket) {
            socket.removeAllListeners();
            socket.disconnect();
            userSockets[namespace] = null;

            console.log(`User ${namespace} Socket Disconnected and Listeners Cleared`);
        }
    } else {
        Object.keys(userSockets).forEach(ns => {
            const socket = userSockets[ns];
            if (socket) {
                socket.removeAllListeners();
                userSockets[ns]?.disconnect();
                console.log(`User ${ns} Socket Disconnectd and Listeners Cleared`);
            }
        });

        userSockets = {};
    }
};