import { create } from 'zustand';

// Define what an incident looks like
interface Incident {
    id: number;
    title: string;
    status: string;
}

interface State {
    incidents: Incident[];
    updateStatus: (id: number, newStatus: string) => void;
}

export const useStore = create<State>((set) => ({
    incidents: [
        { id: 1, title: "Crowd crush at Stage A", status: "todo" },
        { id: 2, title: "Power outage at Bar", status: "in_progress" }
    ],

    updateStatus: (id, newStatus) => set((state) => ({
        // Use .map() to find the ID and change the status, leaving others alone
        incidents: state.incidents.map((inc) =>
            inc.id === id ? { ...inc, status: newStatus } : inc
        ),
    })),
}));