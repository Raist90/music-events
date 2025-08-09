package service

import (
	"fmt"
)

type Service interface {
	Fetcher
}

func New() Service {
	return service{}
}

type Fetcher interface {
	Fetch(url string, opts fetchOpts) ([]byte, error)
}

type service struct{}

func (s service) Fetch(url string, opts fetchOpts) ([]byte, error) {
	if url == "" {
		return nil, fmt.Errorf("URL cannot be empty")
	}

	return fetch(url, opts)
}
