package main

import (
	"backend/hub"
	"backend/models"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

/**
 * THE WEBSOCKET UPGRADER:
 * - 'Upgrader': A tool that converts (upgrades) a standard HTTP request
 * into a persistent, two-way WebSocket connection.

 * - 'r *http.Request': Contains metadata about the incoming connection
 * (like the IP or the website it's coming from).

 * - 'CheckOrigin': A security filter. We 'return true' to allow our React
 * frontend (port 3000) to talk to our Go backend (port 8080).
 */

// 1. Set up the upgrader configuration
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWS(h *hub.Hub, c *gin.Context) {
	// 2. Try to upgrade the connection
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return // Handle error
	}

	// 3. Register the client and send existing incidents
	h.Mu.Lock()
	h.Clients[conn] = true
	for _, inc := range h.Incidents {
		msg := models.Message{
			Action:   "add",
			Incident: inc,
		}
		payload, _ := json.Marshal(msg)
		conn.WriteMessage(1, payload)
	}
	h.Mu.Unlock()

	// 4. Ensure cleanup happens
	// 'defer': Schedules this block to run ONLY when the function exits
	defer func() {
		h.Mu.Lock()
		delete(h.Clients, conn)
		h.Mu.Unlock()
		conn.Close()
	}()

	// 5. Listen for messages from this client and broadcast them
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break // Exit loop if user disconnects
		}
		// Forward the message to the hub for processing and broadcasting
		h.Broadcast <- msg
	}
}
