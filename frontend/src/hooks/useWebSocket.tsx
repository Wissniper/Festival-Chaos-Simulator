import { useEffect } from 'react';

export const useWebSocket = (url: string) => {
    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => console.log("Connected to Control Room");
        socket.onclose = () => console.log("Disconnected");

        return () => socket.close();
    }, [url]);
};

export {};