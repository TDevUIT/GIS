import { io, type Socket } from "socket.io-client";

export default defineNuxtPlugin(() => {
    const socketUrl = 'http://localhost:8000/events';

    const socket: Socket = io(socketUrl, {
        autoConnect: false,
        transports: ['websocket'],
    });

    return {
        provide: {
            socket: socket,
        },
    };
});
