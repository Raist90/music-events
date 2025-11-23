package service

import (
	"encoding/json"
	"fmt"
	"log"
	"md-api/env"
	"md-api/model"
	"net/url"
)

type ServiceRequest struct {
	Headers  map[string]string
	Endpoint string
	Query    url.Values
}

type ticketmasterService struct {
	apiKey  string
	baseUrl string
}

func NewTicketmasterService() *ticketmasterService {
	return &ticketmasterService{
		apiKey:  env.TicketMasterApiKey.Get(),
		baseUrl: env.TicketMasterApiUrl.Get(),
	}
}

func (s *ticketmasterService) GetEvents(req ServiceRequest) ([]byte, error) {
	query := req.Query
	query.Set("apikey", s.apiKey)

	url := s.baseUrl + req.Endpoint + "?" + query.Encode()
	body, err := fetch(url, fetchOpts{
		Headers: map[string]string{
			"Authorization": "Bearer " + env.TicketMasterApiKey.Get(),
		},
	})

	if err != nil {
		return nil, fmt.Errorf("fetching music events: %v", err)
	}

	if len(body) == 0 {
		return nil, fmt.Errorf("no data found")
	}

	var data = model.Ticketmaster{}
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, fmt.Errorf("unmarshaling response: %v", err)
	}

	return body, nil
}
