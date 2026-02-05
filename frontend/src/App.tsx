import React from 'react';
import './App.css';
import { ChaosMeter } from './components/ChaosMeter';
import { Log } from './components/Log';
import { useStore } from './store';
import { useWebSocket } from './hooks/useWebSocket';
import { KanbanColumn } from './components/Kanban/KanbanColumn';

function App() {
  useWebSocket('ws://localhost:8080/ws');

  const updateStatus = useStore((state) => state.updateStatus);
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
              <KanbanColumn
                  status="todo"
                  incidents={incidents.filter(i => i.status === 'todo')}
                  onMove={updateStatus}
              />

            <KanbanColumn
                status="in_progress"
                incidents={incidents.filter(i => i.status === 'in_progress')}
                onMove={updateStatus}
            />

            <KanbanColumn
                status="done"
                incidents={incidents.filter(i => i.status === 'done')}
                onMove={updateStatus}
            />
          </section>

          <aside>
            <Log />
          </aside>
        </main>
      </div>
  );
}

export default App;