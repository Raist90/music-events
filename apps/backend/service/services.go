package service

import (
	"fmt"
	"md-api/client"
)

type Service interface {
	Fetcher
}

func NewService() Service {
	return service{}
}

type Fetcher interface {
	Fetch(url string, opts client.Opts) ([]byte, error)
}

type service struct{}

func (s service) Fetch(url string, opts client.Opts) ([]byte, error) {
	if url == "" {
		return nil, fmt.Errorf("URL cannot be empty")
	}

	return client.Fetch(url, opts)
}
