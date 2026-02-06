package main

import (
	"backend/hub"
	"backend/models"
	"encoding/json"
	"fmt"
	"time"
)

// incidentGenerator periodically creates and broadcasts new "Incident" messages to all connected clients via the Hub.
func incidentGenerator(h *hub.Hub) {
	// Create a ticker that sends an event every 5 seconds.
	ticker := time.NewTicker(5 * time.Second)

	// Keep track of the incident ID, starting from 1.
	var id int64 = 1

	// The for loop runs each time the ticker sends a value (every 5 seconds).
	for range ticker.C {
		// Create a new Incident struct with an incrementing ID,
		// a generated title, and a default status of "todo".
		newInc := models.Incident{
			ID:     id,
			Title:  fmt.Sprintf("Incident #%d: Crowd Surge", id),
			Status: "todo",
		}

		// Wrap the incident in a message with action type
		msg := models.Message{
			Action:   "add",
			Incident: &newInc,
		}

		// Convert the Message struct into JSON for transmission over WebSocket.
		payload, _ := json.Marshal(msg)

		// Send the JSON payload into the Hub's Broadcast channel,
		// which will distribute it to all connected clients.
		h.Broadcast <- payload

		// Increment the incident ID for the next loop iteration.
		id++
	}
}
