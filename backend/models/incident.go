package models

type Incident struct {
	ID     int64  `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
}

// Message wraps an incident with an action type for WebSocket communication
type Message struct {
	Action   string    `json:"action"` // "add", "update", "delete"
	Incident *Incident `json:"incident,omitempty"`
	ID       int64     `json:"id,omitempty"`     // Used for update/delete action
	Status   string    `json:"status,omitempty"` // Used for update action
}
