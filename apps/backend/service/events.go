package service

import (
	"fmt"
	"md-api/config"
)

type opts []string

func MusicEvents(s Service, _opts opts) ([]byte, error) {
	var opts string
	for i, opt := range _opts {
		println(opt)
		if opt == "attractionId=" {
			continue
		}

		if i > 0 {
			opts += "&" + opt
		} else {
			opts += opt
		}
	}

	url := config.Config.Api.Ticketmaster.URL + "/events.json?" + opts + "&apikey=" + config.Config.Api.Ticketmaster.Key
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
