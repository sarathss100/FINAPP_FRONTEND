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

    console.log(`New User ${namespace} Socket Connected`);

    userSockets[namespace] = newSocket;

    return newSocket;
};

export const disconnectUserSocket = function(namespace?: string) {
    if (namespace) {
        if (userSockets[namespace]) {
            userSockets[namespace]?.disconnect();
            userSockets[namespace] = null;
            console.log(`User ${namespace} Socket Disconnected`);
        }
    } else {
        Object.keys(userSockets).forEach(ns => {
            userSockets[ns]?.disconnect();
            console.log(`User ${ns} Socket Disconnected`);
        });
        userSockets = {};
    }
};