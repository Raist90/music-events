package config

import "md-api/env"

type Ticketmaster struct {
	URL    string
	Key    string
	Secret string
}

func newTicketmaster() *Ticketmaster {
	return &Ticketmaster{
		URL:    env.TicketMasterApiUrl.Get(),
		Key:    env.TicketMasterApiKey.Get(),
		Secret: env.TicketMasterApiSecret.Get(),
	}
}
