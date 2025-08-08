package config

import "md-api/env"

type Ticketmaster struct {
	URL    string
	Key    string
	Secret string
}

func newTicketmaster() *Ticketmaster {
	return &Ticketmaster{
		URL:    env.MustGetenv("TICKETMASTER_API_URL"),
		Key:    env.MustGetenv("TICKETMASTER_API_KEY"),
		Secret: env.MustGetenv("TICKETMASTER_API_SECRET"),
	}
}
