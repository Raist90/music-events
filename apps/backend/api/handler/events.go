package handler

import (
	"encoding/json"
	"fmt"
	"md-api/model"
	"md-api/service"
	"net/http"
)

type data struct {
	Data model.TicketmasterResponse `json:"events"`
}

func GetEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	s := service.New()
	body, err := service.MusicEvents(s, []string{
		"classificationName=music",
		"countryCode=IT",
		"locale=it-it",
		"city=Milano",
		"sort=date,asc",
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("fetching events: %v", err), http.StatusInternalServerError)
		return
	}
	if len(body) == 0 {
		http.Error(w, "no events found", http.StatusNotFound)
		return
	}

	var data = data{}
	if err := json.Unmarshal(body, &data.Data); err != nil {
		http.Error(w, fmt.Sprintf("unmarshalling response: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(body)))
	w.Write(body)
}
