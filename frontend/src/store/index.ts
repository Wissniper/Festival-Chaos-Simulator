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
    addIncident: (inc: Incident) => void;
    removeIncident: (id: number) => void;
}

export const useStore = create<State>((set) => ({
    incidents: [],

    updateStatus: (id, newStatus) => set((state) => ({
        // Use .map() to find the ID and change the status, leaving others alone
        incidents: state.incidents.map((inc) =>
            inc.id === id ? { ...inc, status: newStatus } : inc
        ),
    })),

    addIncident: (newInc: Incident) => set((state) => ({
        incidents: state.incidents.find(i => i.id === newInc.id)
            ? state.incidents
            : [...state.incidents, newInc]
    })),

    removeIncident: (id: number) => set((state) => ({
        incidents: state.incidents.filter(i => i.id !== id)
    }))
}));
