import { create } from 'zustand';

interface Incident {
    id: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
}

interface State {
    incidents: Incident[];
    setIncidents: (incidents: Incident[]) => void;
}

export const useStore = create<State>((set) => ({
    incidents: [],
    setIncidents: (incidents) => set({ incidents }),
}));