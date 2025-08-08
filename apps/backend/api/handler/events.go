package handler

import (
	"fmt"
	"md-api/service"
	"net/http"
)

func GetEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	// w.Header().Set("Content-Type", "application/json")

	body, err := service.MusicEvents()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching events: %v", err), http.StatusInternalServerError)
		return
	}
	if _, err = w.Write(body); err != nil {
		http.Error(w, fmt.Sprintf("Error writing response: %v", err), http.StatusInternalServerError)
		return
	}
}
