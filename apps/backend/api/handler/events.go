package handler

import (
	"fmt"
	ticketmasterService "md-api/ticketmaster/service"
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

	s := ticketmasterService.NewTicketmasterService()
	events, err := s.GetEvents(ticketmasterService.TicketmasterRequest{
		Endpoint: "/events.json",
		Query:    q,
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("fetching events: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(events)))
	w.WriteHeader(http.StatusOK)
	w.Write(events)
}
