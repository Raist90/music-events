package service

import (
	"fmt"
	"md-api/client"
	"md-api/config"
)

type Fetcher interface {
	Fetch(url string, opts client.Opts) ([]byte, error)
}

type fetcher struct{}

func NewFetcher(url string, opts client.Opts) Fetcher {
	return fetcher{}
}

func (s fetcher) Fetch(url string, opts client.Opts) ([]byte, error) {
	if url == "" {
		return nil, fmt.Errorf("URL cannot be empty")
	}

	return client.Fetch(url, opts)
}

// TODO: If this only embeds Fetcher we can remove it
// and just return Fetcher directly from NewService
type Service interface {
	Fetcher
}

func NewService() Service {
	return fetcher{}
}

func MusicEvents() ([]byte, error) {
	url := config.Config.Api.Ticketmaster.URL + "/events.json?classificationName=music" + "&apikey=" + config.Config.Api.Ticketmaster.Key
	s := NewService()

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
