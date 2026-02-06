import { useEffect, useRef, useCallback } from 'react';
import { useStore } from "../store";

interface Incident {
    id: number;
    title: string;
    status: string;
}

interface Message {
    action: 'add' | 'update' | 'delete';
    incident?: Incident;
    id?: number;
    status?: string;
}

export const useWebSocket = (url: string) => {
    const addIncident = useStore((state) => state.addIncident);
    const updateStatus = useStore((state) => state.updateStatus);
    const removeIncident = useStore((state) => state.removeIncident);

    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onmessage = (e: MessageEvent) => {
            const message: Message = JSON.parse(e.data);
            console.log("Message received:", message);

            switch (message.action) {
                case 'add':
                    if (message.incident) {
                        console.log("Incident added:", message.incident.id);
                        addIncident(message.incident);
                    }
                    break;
                case 'update':
                    if (message.id !== undefined && message.status) {
                        updateStatus(message.id, message.status);
                    }
                    break;
                case 'delete':
                    if (message.id !== undefined) {
                        removeIncident(message.id);
                    }
                    break;
                default:
                    console.log("Unknown action:", message.action, "Full message:", message);
            }
        };

        socket.onclose = () => {
            console.log("Socket closed, Reconnecting...");
            setTimeout(() => 3000);
        };

        return () => socket.close();
    }, [url, addIncident, updateStatus, removeIncident]);

    // Send an add action to the backend
    const sendAdd = useCallback((incident: Incident) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                action: 'add',
                incident
            }));
        }
    }, []);

    // Send an update action to the backend
    const sendUpdate = useCallback((id: number, status: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                action: 'update',
                id,
                status
            }));
        }
    }, []);

    // Send a delete action to the backend
    const sendDelete = useCallback((id: number) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                action: 'delete',
                id
            }));
        }
    }, []);

    return { sendAdd, sendUpdate, sendDelete };
};
