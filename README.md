# Festival-Chaos-Simulator

**A Go & React Concurrency Showcase**

Build a high-stakes **Festival Chaos Simulator** simulator: a Golang-driven backend that generates "chaos" and a React dashboard where a live "crew" resolves incidents in real-time. This project runs entirely locally to focus on **WebSockets**, **concurrency patterns**, and **complex UI state management**.

---

## 1. Project Concept

A real-time "Student Kick-Off" control room application. A Golang server continuously generates incidents and tasks, pushing them via WebSockets to a React dashboard. Multiple "crew members" can open the app simultaneously to view, claim, and resolve issues live across all connected browsers.

---

## 2. Core Functionality

### Live Incident Feed

* **Auto-Generation:** Cards appear instantly (e.g., *"Stage 1 – Audio Out"*, *"Food Truck 3 – Power Failure"*).
* **Metadata:** Every incident tracks priority (Low/Medium/High) and zone (Stage, Bar, Food, Entrance).

### Collaborative Crew Board

* **Multi-user Sync:** Everyone sees the same board (To-Do / In Progress / Done).
* **Live Updates:** Dragging a card in one tab updates the position instantly for all other users.

### Chaos Metrics & Logs

* **Chaos Meter:** A visual score that rises when issues pile up and drops as they are resolved.
* **Event Log:** A real-time stream (e.g., *"19:02: Lighting crash at Stage 2"*, *"19:03: Joris picked up task"*).

### Simulation Controls (Admin)

* **Frequency Slider:** Adjust the pace from "Quiet Shift" to "Total Chaos."
* **Wave Injector:** Toggle specific triggers like "Random Crash Waves."

---

## 3. Technical Architecture

### **Backend (Golang)**

* **Server:** Gin HTTP framework.
* **Communication:** Gorilla WebSocket for the `/ws` endpoint.
* **Concurrency:**
* **`incidentGenerator` Goroutine:** Periodically pushes random incidents into an internal channel.
* **The "Hub":** Coordinates all incoming events and broadcasts them to all active clients.


* **State:** In-memory maps/slices for Incidents and Clients (no DB required).

### **Frontend (React)**

* **Connectivity:** Custom `useWebSocket` hook for connection management and auto-reconnect.
* **State Management:** Zustand or Context API for incidents and the Chaos Score.
* **UI Components:**
* `IncidentBoard` (Kanban layout)
* `LiveFeed` (Scrolling logs)
* `ChaosMeter` (Visual gauges)



---

## 4. Key Data Structures

### **Go (Backend)**

```go
type Incident struct {
    ID        int    `json:"id"`
    Title     string `json:"title"`
    Location  string `json:"location"` // e.g., Stage A, Bar, Entrance
    Severity  string `json:"severity"` // low, medium, high
    Status    string `json:"status"`   // todo, in_progress, done
    Assignee  string `json:"assignee"` // Crew member name
}

type ServerState struct {
    Incidents map[int]*Incident
    Clients   map[*websocket.Conn]bool
    Mu        sync.Mutex // Essential for thread-safety
}
```

---

## 5. Primary Screens

| Screen | Key Features |
| --- | --- |
| **Login** | Choose a crew name to identify yourself on the board. |
| **Main Dashboard** | Kanban board (Left), Chaos Meter (Top), Live Event Log (Right). |
| **Control Panel** | Admin sliders for "Incident Frequency" and "Start/Pause Simulation." |
