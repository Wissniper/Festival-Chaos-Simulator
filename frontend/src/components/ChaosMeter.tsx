import React from 'react';
import { useStore } from '../store';

export const ChaosMeter = () => {
    const incidents = useStore((state) => state.incidents);
    const toBeDoneOrFinished = incidents.filter(i => i.status !== "done").length;
    const total = incidents.length;
    const raw = Math.floor(((toBeDoneOrFinished)/total)*100);
    const chaosLevel = isNaN(raw) ? 0 : raw ;

    return (
        <div className="chaos-meter">
            <h2>Chaos Level: {chaosLevel}%</h2>
            <div style={{ width: '100%', background: '#333' }}>
                <div style={{ width: `${chaosLevel}%`, background: 'red', height: '20px' }} />
            </div>
        </div>
    );
};