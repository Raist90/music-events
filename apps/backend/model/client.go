package model

type Ticketmaster struct {
	Events []Event `json:"events"`
}

type Event struct {
	Dates  dates  `json:"dates"`
	Id     string `json:"id"`
	Image  Image  `json:"image"`
	Locale string `json:"locale"`
	Name   string `json:"name"`
	Status string `json:"status"` // e.g. "onsale"
	Url    string `json:"url"`
	Venue  venue  `json:"venue"`
}

type Image struct {
	Alt string `json:"alt"`
	URL string `json:"url"`
}

type dates struct {
	DateTime  string `json:"dateTime"`
	LocalDate string `json:"localDate"`
	LocalTime string `json:"localTime"`
	Timezone  string `json:"timezone"` // e.g. "Europe/Berlin"
}

type venue struct {
	Address    string `json:"address"`
	City       string `json:"city"`
	Country    string `json:"country"`
	Id         string `json:"id"`
	Locale     string `json:"locale"`
	Location   string `json:"location"`
	Name       string `json:"name"`
	PostalCode string `json:"postalCode"`
	State      string `json:"state"`
	Timezone   string `json:"timezone"` // e.g. "Europe/Berlin"
	Type       string `json:"type"`     // e.g. "venue"
	URL        string `json:"url"`
}
