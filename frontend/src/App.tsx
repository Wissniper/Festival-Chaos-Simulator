import React from 'react';
import './App.css';
import { ChaosMeter } from './components/ChaosMeter';
import { Log } from './components/Log';
import { useStore } from './store';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  useWebSocket('ws://localhost:8080/ws');
  const incidents = useStore((state) => state.incidents);

  return (
      <div className="app-container">
        <header className="header">
          <h1>FESTIVAL CONTROL</h1>
          <p>Operational Status: Live</p>
        </header>

        <ChaosMeter />

        <main className="main-grid">
          <section className="kanban-board">
            <div className="column">
              <h3>Todo</h3>
              {incidents.filter(i => i.status === 'todo').map(inc => (
                  <div key={inc.id} className="incident-card">
                    {inc.title}
                  </div>
              ))}
            </div>

            <div className="column">
              <h3>In Progress</h3>
              {incidents.filter(i => i.status === 'in_progress').map(inc => (
                  <div key={inc.id} className="incident-card">
                    {inc.title}
                  </div>
              ))}
            </div>

            <div className="column">
              <h3>Resolved</h3>
              {incidents.filter(i => i.status === 'done').map(inc => (
                  <div key={inc.id} className="incident-card">
                    {inc.title}
                  </div>
              ))}
            </div>
          </section>

          <aside>
            <Log />
          </aside>
        </main>
      </div>
  );
}

export default App;