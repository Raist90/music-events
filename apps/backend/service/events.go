package service

import (
	"fmt"
	"md-api/env"
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

	url := env.TicketMasterApiUrl.Get() + "/events.json?" + opts + "&apikey=" + env.TicketMasterApiKey.Get()
	res, err := s.Fetch(url, fetchOpts{
		Headers: map[string]string{
			"Authorization": "Bearer " + env.TicketMasterApiKey.Get(),
		},
	})
	if err != nil {
		return nil, fmt.Errorf("fetching music events: %v", err)
	}

	return res, nil
}
