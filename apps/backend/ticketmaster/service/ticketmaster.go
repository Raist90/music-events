package service

import (
	"encoding/json"
	"fmt"
	"md-api/env"
	fetchService "md-api/fetch/service"
	"md-api/model"
	"net/url"
)

type TicketmasterRequest struct {
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

func (s *ticketmasterService) GetEvents(req TicketmasterRequest) ([]byte, error) {
	query := req.Query
	query.Set("apikey", s.apiKey)
	url := s.baseUrl + req.Endpoint + "?" + query.Encode()
	fetchSvc := fetchService.NewFetchService(url, map[string]string{
		"Authorization": "Bearer " + env.TicketMasterApiKey.Get(),
	})
	body, err := fetchSvc.Fetch()
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
