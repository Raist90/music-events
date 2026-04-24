package http

import (
	"net/http"
	"time"
)

const (
	sevenDaysHours = 7 * 24 * time.Hour
)

func SetAuthCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		HttpOnly: true,
		Secure:   false, // TODO: Set to true in production
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(sevenDaysHours),
	}

	if token == "" {
		// Delete cookie
		cookie.Expires = time.Unix(0, 0)
		cookie.MaxAge = -1
	}
	http.SetCookie(w, cookie)
}
