package hub

import (
	"encoding/json"
	"sync"

	"backend/models"
	"github.com/gorilla/websocket"
)

type Hub struct {
	// A lock to keep the data safe
	Mu        sync.Mutex
	Incidents map[int64]*models.Incident

	// A channel for incoming messages
	Broadcast chan []byte

	// A map where the key is the connection and the value is true
	Clients map[*websocket.Conn]bool
}

/**
 * CONCURRENCY PRIMITIVES IN GO:

 * * 1. CHANNELS (The Communication Pipes):
 * - In Go, "make(chan Type)" is required because channels are reference types.
 * - Without 'make', you have a 'nil' channel that will block forever.
 * - We use "chan []byte" for broadcasting because WebSocket messages are transmitted
 * as raw data. Marshaling to JSON once and sending bytes is more
 * efficient than marshaling for every single client.

 * * 2. MUTEXES (The Shared State Protectors):
 * - "Mutex" stands for Mutual Exclusion.
 * - We use "sync.Mutex" to protect the 'incidents' map and 'clients' map.
 * - Since multiple goroutines (users) can update the board simultaneously,
 * the Mutex ensures only one goroutine can write to a map at a time,
 * preventing "race conditions" or crashes.

 * * 3. WHY 'MAKE' FOR MAPS?
 * - Like channels, maps must be initialized with 'make' before use.
 * - 'make' allocates the underlying hash table so you can safely add
 * keys (like websocket.Conn) to it.
 */

func NewHub() *Hub {
	return &Hub{
		Incidents: make(map[int64]*models.Incident),
		Broadcast: make(chan []byte),
		Clients:   make(map[*websocket.Conn]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case msg := <-h.Broadcast:
			var message models.Message
			if err := json.Unmarshal(msg, &message); err != nil {
				continue
			}

			h.Mu.Lock()

			var broadcastMsg []byte

			// Process action and update server state
			switch message.Action {
			case "add":
				if message.Incident != nil {
					h.Incidents[message.Incident.ID] = message.Incident
					broadcastMsg, _ = json.Marshal(models.Message{
						Action:   "add",
						Incident: message.Incident,
					})
				}
			case "update":
				if inc, exists := h.Incidents[message.ID]; exists {
					inc.Status = message.Status
					broadcastMsg, _ = json.Marshal(models.Message{
						Action:   "update",
						ID:       message.ID,
						Status:   message.Status,
						Incident: inc,
					})
				}
			case "delete":
				delete(h.Incidents, message.ID)
				broadcastMsg, _ = json.Marshal(models.Message{
					Action: "delete",
					ID:     message.ID,
				})
			}

			// Broadcast to all clients
			if broadcastMsg != nil {
				for client := range h.Clients {
					err := client.WriteMessage(1, broadcastMsg)
					if err != nil {
						client.Close()
						delete(h.Clients, client)
					}
				}
			}
			h.Mu.Unlock()
		}
	}
}
