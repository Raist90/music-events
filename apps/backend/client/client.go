package client

import (
	"errors"
	"fmt"
	"io"
	"net/http"
)

type Opts struct {
	Headers map[string]string
}

func Fetch(url string, opts Opts) ([]byte, error) {
	if url == "" {
		return nil, errors.New("URL cannot be empty")
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("Creating request: %w", err)
	}

	if opts.Headers != nil {
		for k, v := range opts.Headers {
			req.Header.Set(k, v)
		}
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("Making request: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Received status code %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("Reading response body: %w", err)
	}

	return body, nil
}
