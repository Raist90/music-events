package model

type TicketmasterResponse struct {
	Embedded embeddedResponse `json:"_embedded"`
}

type embeddedResponse struct {
	Events []eventResponse `json:"events"`
}

type eventResponse struct {
	Classifications []ClassificationResponse `json:"classifications"`
	Dates           datesResponse            `json:"dates"`
	Embedded        eventEmbeddedResponse    `json:"_embedded"`
	Id              string                   `json:"id"`
	Images          []imageResponse          `json:"image"`
	Locale          string                   `json:"locale"`
	Name            string                   `json:"name"`
	Test            bool                     `json:"test"`
	Type            string                   `json:"type"`
	Url             string                   `json:"url"`
}

type cityResponse struct {
	Name string `json:"name"`
}

type countryResponse struct {
	CountryCode string `json:"countryCode"` // e.g. "MX"
	Name        string `json:"name"`
}

type stateResponse struct {
	Country   countryResponse `json:"country"`
	Name      string          `json:"name"`
	StateCode string          `json:"stateCode"` // e.g. "CMDX"
}

type addressResponse struct {
	Line1 string `json:"line1"` // e.g. "Av. Paseo de la Reforma 50"
}

type locationResponse struct {
	Latitude  string `json:"latitude"`  // e.g. 19.432
	Longitude string `json:"longitude"` // e.g. -99.1332
}

type VenueResponse struct {
	Address    addressResponse  `json:"address"`
	City       cityResponse     `json:"city"`
	Country    countryResponse  `json:"country"`
	Id         string           `json:"id"`
	Locale     string           `json:"locale"`
	Location   locationResponse `json:"location"`
	Name       string           `json:"name"`
	PostalCode string           `json:"postalCode"`
	State      stateResponse    `json:"state"`
	Test       bool             `json:"test"`
	Timezone   string           `json:"timezone"` // e.g. "Europe/Berlin"
	Type       string           `json:"type"`     // e.g. "venue"
	URL        string           `json:"url"`
}

type eventEmbeddedResponse struct {
	Venues []VenueResponse `json:"venues"`
}

type imageResponse struct {
	Fallback bool   `json:"fallback"`
	Height   int    `json:"height"`
	Ratio    string `json:"ratio"`
	URL      string `json:"url"`
	Width    int    `json:"width"`
}

type startResponse struct {
	DateTBA        bool   `json:"dateTBA"`
	DateTBD        bool   `json:"dateTBD"`
	DateTime       string `json:"dateTime"`
	LocalDate      string `json:"localDate"`
	LocalTime      string `json:"localTime"`
	NoSpecificTime bool   `json:"noSpecificTime"`
	TimeTBA        bool   `json:"timeTBA"`
}

type statusResponse struct {
	Code string `json:"code"` // e.g. "onsale"
}

type datesResponse struct {
	Start            startResponse  `json:"start"`
	Timezone         string         `json:"timezone"` // e.g. "Europe/Berlin"
	Status           statusResponse `json:"status"`
	SpanMultipleDays bool           `json:"spanMultipleDays"`
}

type ClassificationItemResponse struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type ClassificationResponse struct {
	Family  bool                                  `json:"family"`
	Items   map[string]ClassificationItemResponse `json:"items"`
	Primary bool                                  `json:"primary"`
}
