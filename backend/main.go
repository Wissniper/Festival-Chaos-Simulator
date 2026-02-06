package main

import (
	"backend/hub"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	// 1. Initialize the Hub
	h := hub.NewHub()

	// 2. Start the background workers
	go h.Run()
	go incidentGenerator(h)

	r := gin.Default()
	r.GET("/ws/", func(c *gin.Context) {
		handleWS(h, c)
	})

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Festival Control Ready!")
	})

	r.Run(":8080")
}
