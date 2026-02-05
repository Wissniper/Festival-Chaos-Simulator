import React from 'react';
import { useStore } from '../store';

export const ChaosMeter = () => {
    const incidents = useStore((state) => state.incidents);
    const chaosLevel = incidents.length * 10;

    return (
        <div className="chaos-meter">
            <h2>Chaos Level: {chaosLevel}%</h2>
            <div style={{ width: '100%', background: '#333' }}>
                <div style={{ width: `${chaosLevel}%`, background: 'red', height: '20px' }} />
            </div>
        </div>
    );
};