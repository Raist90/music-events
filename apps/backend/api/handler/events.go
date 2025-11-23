package handler

import (
	"fmt"
	"md-api/service"
	"net/http"
	"net/url"
)

func GetEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	q, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		http.Error(w, "invalid query parameters", http.StatusBadRequest)
		return
	}

	s := service.NewTicketmasterService()
	events, err := s.GetEvents(service.ServiceRequest{
		Endpoint: "/events.json",
		Query:    q,
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("fetching events: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(events)))
	w.Write(events)
}
