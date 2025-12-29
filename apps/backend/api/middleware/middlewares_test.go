package middleware

import (
	"bytes"
	"log"
	"net/http"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"golang.org/x/time/rate"
	"md-api/testutil"
)

// JWT Authentication Middleware Tests

func TestJWTAuth_ValidToken(t *testing.T) {
	testutil.SetupTestEnv(t)

	secret := []byte(testutil.TestJWTSecret)
	token, err := testutil.GenerateTestToken(secret, 24*time.Hour)
	assert.NoError(t, err)

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", &token)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.True(t, handlerCalled, "Handler should be called with valid token")
	testutil.AssertStatusCode(t, rr, http.StatusOK)
}

func TestJWTAuth_MissingToken(t *testing.T) {
	testutil.SetupTestEnv(t)

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.False(t, handlerCalled, "Handler should not be called without token")
	testutil.AssertStatusCode(t, rr, http.StatusUnauthorized)
	testutil.AssertBodyContains(t, rr, "Missing or invalid token")
}

func TestJWTAuth_InvalidBearerFormat(t *testing.T) {
	testutil.SetupTestEnv(t)

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	req.Header.Set("Authorization", "InvalidFormat token123")
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.False(t, handlerCalled)
	testutil.AssertStatusCode(t, rr, http.StatusUnauthorized)
}

func TestJWTAuth_ExpiredToken(t *testing.T) {
	testutil.SetupTestEnv(t)

	secret := []byte(testutil.TestJWTSecret)
	token, err := testutil.GenerateExpiredToken(secret)
	assert.NoError(t, err)

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", &token)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.False(t, handlerCalled, "Handler should not be called with expired token")
	testutil.AssertStatusCode(t, rr, http.StatusUnauthorized)
	testutil.AssertBodyContains(t, rr, "Invalid token")
}

func TestJWTAuth_WrongAudience(t *testing.T) {
	testutil.SetupTestEnv(t)

	secret := []byte(testutil.TestJWTSecret)
	token, err := testutil.GenerateInvalidAudienceToken(secret)
	assert.NoError(t, err)

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", &token)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.False(t, handlerCalled, "Handler should not be called with wrong audience")
	testutil.AssertStatusCode(t, rr, http.StatusUnauthorized)
	testutil.AssertBodyContains(t, rr, "Invalid token audience")
}

func TestJWTAuth_MalformedToken(t *testing.T) {
	testutil.SetupTestEnv(t)

	malformedToken := "not.a.valid.jwt"

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", &malformedToken)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.False(t, handlerCalled)
	testutil.AssertStatusCode(t, rr, http.StatusUnauthorized)
}

func TestJWTAuth_CallsNextHandler(t *testing.T) {
	testutil.SetupTestEnv(t)

	secret := []byte(testutil.TestJWTSecret)
	token, err := testutil.GenerateTestToken(secret, 24*time.Hour)
	assert.NoError(t, err)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Success from handler"))
	})

	middleware := JWTAuth(handler)

	req := testutil.CreateTestRequest("GET", "/", &token)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	testutil.AssertStatusCode(t, rr, http.StatusOK)
	testutil.AssertBodyContains(t, rr, "Success from handler")
}

// Logger Middleware Tests

func TestLogger_LogsRequest(t *testing.T) {
	// Capture log output
	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer log.SetOutput(os.Stderr)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := Logger(handler)

	req := testutil.CreateTestRequest("GET", "/test-path", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	logOutput := buf.String()
	assert.Contains(t, logOutput, "Received request: GET /test-path")
}

func TestLogger_CallsNextHandler(t *testing.T) {
	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	middleware := Logger(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.True(t, handlerCalled, "Logger should call next handler")
	testutil.AssertStatusCode(t, rr, http.StatusOK)
}

func TestLogger_DifferentMethods(t *testing.T) {
	methods := []string{"GET", "POST", "PUT", "DELETE", "PATCH"}

	for _, method := range methods {
		t.Run(method, func(t *testing.T) {
			var buf bytes.Buffer
			log.SetOutput(&buf)
			defer log.SetOutput(os.Stderr)

			handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			})

			middleware := Logger(handler)

			req := testutil.CreateTestRequest(method, "/test", nil)
			rr := testutil.CreateTestResponseRecorder()

			middleware.ServeHTTP(rr, req)

			logOutput := buf.String()
			assert.Contains(t, logOutput, "Received request: "+method+" /test")
		})
	}
}

// CORS Middleware Tests

func TestCors_SetsHeader(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := Cors(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	testutil.AssertHeader(t, rr, "Access-Control-Allow-Origin", "http://localhost:3000")
}

func TestCors_CallsNextHandler(t *testing.T) {
	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	middleware := Cors(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.True(t, handlerCalled, "CORS should call next handler")
	testutil.AssertStatusCode(t, rr, http.StatusOK)
}

func TestCors_PreservesOtherHeaders(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
	})

	middleware := Cors(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	testutil.AssertHeader(t, rr, "Access-Control-Allow-Origin", "http://localhost:3000")
	testutil.AssertHeader(t, rr, "Content-Type", "application/json")
}

// Middleware Chain Tests

func TestChain_SingleMiddleware(t *testing.T) {
	middlewareCalled := false

	mw := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			middlewareCalled = true
			next.ServeHTTP(w, r)
		}
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	chained := Chain(mw)(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	chained.ServeHTTP(rr, req)

	assert.True(t, middlewareCalled)
	testutil.AssertStatusCode(t, rr, http.StatusOK)
}

func TestChain_MultipleMiddleware_ExecutionOrder(t *testing.T) {
	var executionOrder []string

	mw1 := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			executionOrder = append(executionOrder, "mw1-before")
			next.ServeHTTP(w, r)
			executionOrder = append(executionOrder, "mw1-after")
		}
	}

	mw2 := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			executionOrder = append(executionOrder, "mw2-before")
			next.ServeHTTP(w, r)
			executionOrder = append(executionOrder, "mw2-after")
		}
	}

	mw3 := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			executionOrder = append(executionOrder, "mw3-before")
			next.ServeHTTP(w, r)
			executionOrder = append(executionOrder, "mw3-after")
		}
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		executionOrder = append(executionOrder, "handler")
		w.WriteHeader(http.StatusOK)
	})

	chained := Chain(mw1, mw2, mw3)(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	chained.ServeHTTP(rr, req)

	// Expected order: mw1 → mw2 → mw3 → handler → mw3 → mw2 → mw1
	expected := []string{
		"mw1-before",
		"mw2-before",
		"mw3-before",
		"handler",
		"mw3-after",
		"mw2-after",
		"mw1-after",
	}

	assert.Equal(t, expected, executionOrder)
}

func TestChain_EarlyTermination(t *testing.T) {
	var executionOrder []string

	mw1 := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			executionOrder = append(executionOrder, "mw1")
			next.ServeHTTP(w, r)
		}
	}

	// This middleware terminates the chain early
	mw2 := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			executionOrder = append(executionOrder, "mw2-terminate")
			http.Error(w, "Forbidden", http.StatusForbidden)
			// Note: Not calling next.ServeHTTP
		}
	}

	mw3 := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			executionOrder = append(executionOrder, "mw3")
			next.ServeHTTP(w, r)
		}
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		executionOrder = append(executionOrder, "handler")
		w.WriteHeader(http.StatusOK)
	})

	chained := Chain(mw1, mw2, mw3)(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	chained.ServeHTTP(rr, req)

	// mw2 should terminate, so mw3 and handler should not execute
	expected := []string{"mw1", "mw2-terminate"}
	assert.Equal(t, expected, executionOrder)
	testutil.AssertStatusCode(t, rr, http.StatusForbidden)
}

func TestChain_NoMiddleware(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Handler called"))
	})

	chained := Chain()(handler)

	req := testutil.CreateTestRequest("GET", "/", nil)
	rr := testutil.CreateTestResponseRecorder()

	chained.ServeHTTP(rr, req)

	testutil.AssertStatusCode(t, rr, http.StatusOK)
	testutil.AssertBodyContains(t, rr, "Handler called")
}

// Integration Test: Full Middleware Stack

func TestFullMiddlewareStack(t *testing.T) {
	testutil.SetupTestEnv(t)

	// Create a rate limiter for this test
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	rateLimiterInstance = rl

	secret := []byte(testutil.TestJWTSecret)
	token, err := testutil.GenerateTestToken(secret, 24*time.Hour)
	assert.NoError(t, err)

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Success"))
	})

	// Apply full middleware stack
	fullStack := Chain(
		RateLimit,
		JWTAuth,
		Logger,
		Cors,
	)(handler)

	req := testutil.CreateTestRequestWithIP("GET", "/test", "192.168.1.1:12345", &token)
	rr := testutil.CreateTestResponseRecorder()

	fullStack.ServeHTTP(rr, req)

	assert.True(t, handlerCalled)
	testutil.AssertStatusCode(t, rr, http.StatusOK)
	testutil.AssertHeader(t, rr, "Access-Control-Allow-Origin", "http://localhost:3000")
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Limit")
	testutil.AssertBodyContains(t, rr, "Success")
}

func TestFullMiddlewareStack_RateLimitBlocks(t *testing.T) {
	testutil.SetupTestEnv(t)

	// Restrictive rate limiter
	rl := newRateLimiterWithConfig(rate.Limit(1), 1)
	rateLimiterInstance = rl

	secret := []byte(testutil.TestJWTSecret)
	token, err := testutil.GenerateTestToken(secret, 24*time.Hour)
	assert.NoError(t, err)

	handlerCalled := 0
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled++
		w.WriteHeader(http.StatusOK)
	})

	fullStack := Chain(
		RateLimit,
		JWTAuth,
		Logger,
		Cors,
	)(handler)

	ip := "192.168.1.100:12345"

	// First request should succeed
	req1 := testutil.CreateTestRequestWithIP("GET", "/test", ip, &token)
	rr1 := testutil.CreateTestResponseRecorder()
	fullStack.ServeHTTP(rr1, req1)
	testutil.AssertStatusCode(t, rr1, http.StatusOK)

	// Second request should be rate limited (JWT never checked)
	req2 := testutil.CreateTestRequestWithIP("GET", "/test", ip, &token)
	rr2 := testutil.CreateTestResponseRecorder()
	fullStack.ServeHTTP(rr2, req2)
	testutil.AssertStatusCode(t, rr2, http.StatusTooManyRequests)

	// Handler should only be called once
	assert.Equal(t, 1, handlerCalled)
}

func TestFullMiddlewareStack_InvalidTokenBlocks(t *testing.T) {
	testutil.SetupTestEnv(t)

	// Permissive rate limiter
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	rateLimiterInstance = rl

	invalidToken := "invalid.jwt.token"

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	fullStack := Chain(
		RateLimit,
		JWTAuth,
		Logger,
		Cors,
	)(handler)

	req := testutil.CreateTestRequestWithIP("GET", "/test", "192.168.1.1:12345", &invalidToken)
	rr := testutil.CreateTestResponseRecorder()

	fullStack.ServeHTTP(rr, req)

	assert.False(t, handlerCalled, "Handler should not be called with invalid token")
	testutil.AssertStatusCode(t, rr, http.StatusUnauthorized)

	// Rate limit headers should still be present (RateLimit runs first)
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Limit")
}
