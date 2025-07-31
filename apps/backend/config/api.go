package config

type Api struct {
	Ticketmaster *Ticketmaster
}

func newApi() *Api {
	return &Api{
		Ticketmaster: newTicketmaster(),
	}
}
