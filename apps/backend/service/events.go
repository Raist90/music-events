package service

import (
	"fmt"
	"md-api/config"
)

func MusicEvents(s Service) ([]byte, error) {
	url := config.Config.Api.Ticketmaster.URL + "/events.json?classificationName=music" + "&apikey=" + config.Config.Api.Ticketmaster.Key
	res, err := s.Fetch(url, fetchOpts{
		Headers: map[string]string{
			"Authorization": "Bearer " + config.Config.Api.Ticketmaster.Key,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("fetching music events: %v", err)
	}

	return res, nil
}
