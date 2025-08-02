package service

import (
	"fmt"
	"md-api/client"
	"md-api/config"
)

func GetMusicEvents() ([]byte, error) {
	url := config.Config.Api.Ticketmaster.URL + "/events.json?classificationName=music" + "&apikey=" + config.Config.Api.Ticketmaster.Key

	body, err := client.Fetch(url, client.Opts{
		Headers: map[string]string{
			"Authorization": "Bearer " + config.Config.Api.Ticketmaster.Key,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("Error fetching music events: %v", err)
	}

	return body, nil
}
