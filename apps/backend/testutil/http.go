package testutil

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

// CreateTestRequest creates an HTTP request for testing.
// If token is provided, adds Authorization header.
func CreateTestRequest(method, path string, token *string) *http.Request {
	req := httptest.NewRequest(method, path, nil)
	if token != nil {
		req.Header.Set("Authorization", "Bearer "+*token)
	}
	return req
}

// CreateTestRequestWithIP creates an HTTP request with a custom RemoteAddr (IP).
func CreateTestRequestWithIP(method, path, ip string, token *string) *http.Request {
	req := CreateTestRequest(method, path, token)
	req.RemoteAddr = ip
	return req
}

// CreateTestResponseRecorder creates a response recorder for capturing responses.
func CreateTestResponseRecorder() *httptest.ResponseRecorder {
	return httptest.NewRecorder()
}

// AssertStatusCode verifies the response status code matches expected value.
func AssertStatusCode(t *testing.T, rr *httptest.ResponseRecorder, expected int) {
	t.Helper()
	assert.Equal(t, expected, rr.Code, "Expected status code %d, got %d. Body: %s",
		expected, rr.Code, rr.Body.String())
}

// AssertHeader verifies a response header matches the expected value.
func AssertHeader(t *testing.T, rr *httptest.ResponseRecorder, key, expected string) {
	t.Helper()
	actual := rr.Header().Get(key)
	assert.Equal(t, expected, actual, "Expected header %s=%s, got %s", key, expected, actual)
}

// AssertHeaderExists verifies a response header exists.
func AssertHeaderExists(t *testing.T, rr *httptest.ResponseRecorder, key string) {
	t.Helper()
	actual := rr.Header().Get(key)
	assert.NotEmpty(t, actual, "Expected header %s to exist", key)
}

// AssertBodyContains verifies the response body contains the expected substring.
func AssertBodyContains(t *testing.T, rr *httptest.ResponseRecorder, expected string) {
	t.Helper()
	body := rr.Body.String()
	assert.Contains(t, body, expected, "Expected body to contain %s, got: %s", expected, body)
}

// SetupTestEnv sets up test environment variables.
func SetupTestEnv(t *testing.T) {
	t.Helper()
	t.Setenv("JWT_SECRET", TestJWTSecret)
	t.Setenv("ENVIRONMENT", "test")
	t.Setenv("PORT", ":8080")
	t.Setenv("TICKETMASTER_API_URL", "https://test.api.ticketmaster.com")
	t.Setenv("TICKETMASTER_API_KEY", "test-key")
	t.Setenv("TICKETMASTER_API_SECRET", "test-secret")
}
