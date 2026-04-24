package service

import (
	"errors"
	"fmt"
	"io"
	"net/http"
)

type fetchOpts struct {
	Headers map[string]string
}

type fetchService struct {
	url     string
	headers map[string]string
}

func NewFetchService(url string, headers map[string]string) *fetchService {
	return &fetchService{
		url:     url,
		headers: headers,
	}
}

func (s *fetchService) Fetch() ([]byte, error) {
	if s.url == "" {
		return nil, errors.New("URL cannot be empty")
	}

	req, err := http.NewRequest("GET", s.url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	if s.headers != nil {
		for k, v := range s.headers {
			req.Header.Set(k, v)
		}
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("making request: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received status code %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body: %w", err)
	}

	return body, nil
}
