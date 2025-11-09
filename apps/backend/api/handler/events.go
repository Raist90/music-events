package handler

import (
	"encoding/json"
	"fmt"
	"md-api/model"
	"md-api/service"
	"net/http"
	"strings"
)

type data struct {
	Data model.Ticketmaster `json:"events"`
}

func GetEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	page := r.URL.Query().Get("page")
	var p string
	if page == "" {
		p = "0"
	} else {
		p = page
	}

	city := r.URL.Query().Get("city")

	country := r.URL.Query().Get("country")
	if country == "" {
		country = "IT"
	}

	var locale string
	if country == "GB" || country == "US" {
		locale = "en"
	} else {
		locale = strings.ToLower(country)
	}

	attractionId := r.URL.Query().Get("attractionId")
	startDate := r.URL.Query().Get("startDateTime")
	endDate := r.URL.Query().Get("endDateTime")
	size := r.URL.Query().Get("size")
	genreId := r.URL.Query().Get("genreId")

	s := service.New()
	body, err := service.MusicEvents(s, []string{
		"attractionId=" + attractionId,
		"classificationName=music",
		"countryCode=" + country,
		"locale=" + locale,
		"city=" + city,
		"startDateTime=" + startDate,
		"endDateTime=" + endDate,
		"sort=date,asc",
		"genreId=" + genreId,
		"page=" + p,
		"size=" + size,
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
