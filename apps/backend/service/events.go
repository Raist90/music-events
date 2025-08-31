package service

import (
	"fmt"
	"md-api/config"
	"strings"
)

type opts []string

func MusicEvents(s Service, _opts opts) ([]byte, error) {
	var opts string
	for _, opt := range _opts {
		s := strings.Split(opt, "=")
		if s[1] == "" {
			continue
		}

		if len(opts) == 0 {
			opts += opt
		} else {
			opts += "&" + opt
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
