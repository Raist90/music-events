package service

import (
	"fmt"
	"md-api/client"
	"md-api/config"
)

func MusicEvents() ([]byte, error) {
	s := NewService()

	url := config.Config.Api.Ticketmaster.URL + "/events.json?classificationName=music" + "&apikey=" + config.Config.Api.Ticketmaster.Key
	res, err := s.Fetch(url, client.Opts{
		Headers: map[string]string{
			"Authorization": "Bearer " + config.Config.Api.Ticketmaster.Key,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("fetching music events: %v", err)
	}

	return res, nil
}
