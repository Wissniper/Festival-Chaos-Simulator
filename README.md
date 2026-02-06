# Festival Chaos Simulator

A real-time collaborative incident management system built with Go and React. Simulates a festival control room where multiple users can manage incidents across a shared Kanban board with live synchronization via WebSockets.

![Go](https://img.shields.io/badge/Go-1.23-00ADD8?logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

## Features

- **Real-time Sync** - All actions (add, update, delete) sync instantly across all connected clients via WebSockets
- **Collaborative Kanban Board** - Drag-and-drop incidents between Todo, In Progress, and Done columns
- **Auto-generated Incidents** - Backend continuously generates new incidents to simulate chaos
- **Multi-device Support** - Works across browsers, tabs, and devices simultaneously
- **Chaos Meter** - Visual indicator of current incident load

## Tech Stack

### Backend
- **Go 1.23** with Gin HTTP framework
- **Gorilla WebSocket** for real-time communication
- **Concurrent architecture** with goroutines and channels
- In-memory state management with mutex protection

### Frontend
- **React 19** with TypeScript
- **Zustand** for state management
- **React DnD** for drag-and-drop functionality
- Custom WebSocket hook with auto-reconnect

## Project Structure

```
├── backend/
│   ├── hub/
│   │   └── hub.go          # WebSocket hub & broadcast logic
│   ├── models/
│   │   └── incident.go     # Data structures
│   ├── generator.go        # Incident auto-generation
│   ├── handler.go          # WebSocket connection handler
│   ├── main.go             # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Kanban/
│   │   │   ├── ChaosMeter.tsx
│   │   │   ├── IncidentCard.tsx
│   │   │   └── Log.tsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.tsx
│   │   ├── store/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── Dockerfile
│   └── nginx.conf
├── .github/workflows/
│   ├── ci-backend.yml
│   ├── ci-frontend.yml
│   ├── cd-backend.yml
│   └── cd-frontend.yml
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Go 1.21+
- Node.js 20+
- Docker & Docker Compose (optional)

### Local Development

**Backend:**
```bash
cd backend
go mod download
go run .
```
Server runs on `http://localhost:8080`

**Frontend:**
```bash
cd frontend
npm install
npm start
```
App runs on `http://localhost:3000`

### Docker

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## API

### WebSocket Endpoint

```
ws://localhost:8080/ws
```

### Message Format

```typescript
interface Message {
  action: 'add' | 'update' | 'delete';
  incident?: Incident;  // For add action
  id?: number;          // For update/delete actions
  status?: string;      // For update action
}

interface Incident {
  id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}
```

## CI/CD

GitHub Actions workflows:

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci-backend.yml` | Push/PR to `backend/**` | Run Go tests & build |
| `ci-frontend.yml` | Push/PR to `frontend/**` | Run npm tests & build |
| `cd-backend.yml` | Tag `v*` | Build & push Docker image |
| `cd-frontend.yml` | Tag `v*` | Build & push Docker image |

Docker images are published to GitHub Container Registry:
```
ghcr.io/<username>/festival-chaos-simulator/backend
ghcr.io/<username>/festival-chaos-simulator/frontend
```

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Frontend  │◄──────────────────►│   Backend   │
│   (React)   │                    │    (Go)     │
└─────────────┘                    └──────┬──────┘
                                          │
                                   ┌──────┴──────┐
                                   │     Hub     │
                                   │  (Broadcast)│
                                   └──────┬──────┘
                                          │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                         Client 1    Client 2    Client N
```

## License

MIT
