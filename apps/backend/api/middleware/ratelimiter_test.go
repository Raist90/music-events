package middleware

import (
	"fmt"
	"net/http"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"golang.org/x/time/rate"
	"md-api/testutil"
)

// Unit Tests for rateLimiter struct

func TestNewRateLimiter(t *testing.T) {
	rl := newRateLimiter()

	assert.NotNil(t, rl)
	assert.NotNil(t, rl.limiters)
	assert.NotNil(t, rl.visitors)
	assert.Equal(t, rate.Limit(10), rl.rps)
	assert.Equal(t, 20, rl.burst)
}

func TestNewRateLimiterWithConfig(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(5), 10)

	assert.NotNil(t, rl)
	assert.Equal(t, rate.Limit(5), rl.rps)
	assert.Equal(t, 10, rl.burst)
}

func TestGetLimiter_CreatesNewLimiter(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	ip := "192.168.1.1"

	limiter := rl.getLimiter(ip)

	assert.NotNil(t, limiter)
	assert.Contains(t, rl.limiters, ip)
	assert.Contains(t, rl.visitors, ip)
}

func TestGetLimiter_ReusesExistingLimiter(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	ip := "192.168.1.1"

	limiter1 := rl.getLimiter(ip)
	limiter2 := rl.getLimiter(ip)

	// Should be the exact same instance
	assert.Same(t, limiter1, limiter2)
}

func TestGetLimiter_UpdatesLastSeen(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	ip := "192.168.1.1"

	// First access
	rl.getLimiter(ip)
	firstSeen := rl.visitors[ip]

	// Wait a bit
	time.Sleep(10 * time.Millisecond)

	// Second access
	rl.getLimiter(ip)
	secondSeen := rl.visitors[ip]

	assert.True(t, secondSeen.After(firstSeen))
}

func TestGetLimiter_ConcurrentAccess(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(100), 200)
	ip := "192.168.1.1"

	var wg sync.WaitGroup
	numGoroutines := 100

	// Access the same IP from multiple goroutines concurrently
	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			limiter := rl.getLimiter(ip)
			assert.NotNil(t, limiter)
		}()
	}

	wg.Wait()

	// Should only have one limiter for the IP
	assert.Len(t, rl.limiters, 1)
	assert.Contains(t, rl.limiters, ip)
}

func TestGetLimiter_MultipleIPs(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)

	ips := []string{"192.168.1.1", "192.168.1.2", "192.168.1.3"}
	limiters := make([]*rate.Limiter, len(ips))

	for i, ip := range ips {
		limiters[i] = rl.getLimiter(ip)
	}

	// Each IP should have its own limiter
	assert.Len(t, rl.limiters, 3)

	// All limiters should be different instances
	assert.NotSame(t, limiters[0], limiters[1])
	assert.NotSame(t, limiters[1], limiters[2])
}

func TestCleanupStaleVisitorsOnce(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)

	// Add some IPs with different last seen times
	ip1 := "192.168.1.1"
	ip2 := "192.168.1.2"
	ip3 := "192.168.1.3"

	rl.getLimiter(ip1)
	rl.getLimiter(ip2)
	rl.getLimiter(ip3)

	// Manually set old timestamps for ip1 and ip2
	rl.visitors[ip1] = time.Now().Add(-10 * time.Minute)
	rl.visitors[ip2] = time.Now().Add(-6 * time.Minute)
	// ip3 stays recent

	// Clean up with 5 minute threshold
	removed := rl.cleanupStaleVisitorsOnce(5 * time.Minute)

	assert.Equal(t, 2, removed)
	assert.NotContains(t, rl.limiters, ip1)
	assert.NotContains(t, rl.limiters, ip2)
	assert.Contains(t, rl.limiters, ip3)
}

func TestGetClientIP_WithPort(t *testing.T) {
	req := testutil.CreateTestRequestWithIP("GET", "/", "127.0.0.1:12345", nil)

	ip := getClientIP(req)

	assert.Equal(t, "127.0.0.1", ip)
}

func TestGetClientIP_WithoutPort(t *testing.T) {
	req := testutil.CreateTestRequestWithIP("GET", "/", "127.0.0.1", nil)

	ip := getClientIP(req)

	assert.Equal(t, "127.0.0.1", ip)
}

func TestGetClientIP_IPv6WithPort(t *testing.T) {
	req := testutil.CreateTestRequestWithIP("GET", "/", "[::1]:12345", nil)

	ip := getClientIP(req)

	assert.Equal(t, "[::1]", ip)
}

func TestSetRateLimitHeaders(t *testing.T) {
	limiter := rate.NewLimiter(rate.Limit(10), 20)
	rr := testutil.CreateTestResponseRecorder()

	setRateLimitHeaders(rr, limiter)

	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Limit")
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Remaining")
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Reset")

	assert.Equal(t, "10", rr.Header().Get("X-RateLimit-Limit"))
}

// Integration Tests for RateLimit middleware

func TestRateLimit_AllowsRequestsBelowLimit(t *testing.T) {
	// Create a rate limiter that allows 5 requests per second
	rl := newRateLimiterWithConfig(rate.Limit(5), 10)
	rateLimiterInstance = rl

	handlerCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)

	req := testutil.CreateTestRequestWithIP("GET", "/", "192.168.1.1:12345", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.True(t, handlerCalled)
	testutil.AssertStatusCode(t, rr, http.StatusOK)
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Limit")
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Remaining")
}

func TestRateLimit_BlocksRequestsAboveLimit(t *testing.T) {
	// Create a very restrictive rate limiter: 1 request per second, burst of 2
	rl := newRateLimiterWithConfig(rate.Limit(1), 2)
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)
	ip := "192.168.1.100:12345"

	successCount := 0
	rateLimitedCount := 0

	// Make 5 rapid requests
	for i := 0; i < 5; i++ {
		req := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
		rr := testutil.CreateTestResponseRecorder()

		middleware.ServeHTTP(rr, req)

		if rr.Code == http.StatusOK {
			successCount++
		} else if rr.Code == http.StatusTooManyRequests {
			rateLimitedCount++
			testutil.AssertHeaderExists(t, rr, "Retry-After")
			assert.Equal(t, "1", rr.Header().Get("Retry-After"))
		}
	}

	// Should allow burst of 2, then block the rest
	assert.Equal(t, 2, successCount)
	assert.Equal(t, 3, rateLimitedCount)
}

func TestRateLimit_PerIPIsolation(t *testing.T) {
	// Each IP should have independent rate limits
	rl := newRateLimiterWithConfig(rate.Limit(1), 2)
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)

	ip1 := "192.168.1.1:12345"
	ip2 := "192.168.1.2:12345"

	// Exhaust ip1's limit
	for i := 0; i < 3; i++ {
		req := testutil.CreateTestRequestWithIP("GET", "/", ip1, nil)
		rr := testutil.CreateTestResponseRecorder()
		middleware.ServeHTTP(rr, req)
	}

	// ip2 should still be able to make requests
	req := testutil.CreateTestRequestWithIP("GET", "/", ip2, nil)
	rr := testutil.CreateTestResponseRecorder()
	middleware.ServeHTTP(rr, req)

	testutil.AssertStatusCode(t, rr, http.StatusOK)
}

func TestRateLimit_BurstCapacity(t *testing.T) {
	// Test that burst capacity works as expected
	rl := newRateLimiterWithConfig(rate.Limit(1), 5) // 1 req/sec, burst of 5
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)
	ip := "192.168.1.1:12345"

	successCount := 0

	// Make 5 rapid requests (should all succeed due to burst)
	for i := 0; i < 5; i++ {
		req := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
		rr := testutil.CreateTestResponseRecorder()
		middleware.ServeHTTP(rr, req)

		if rr.Code == http.StatusOK {
			successCount++
		}
	}

	assert.Equal(t, 5, successCount, "All burst requests should succeed")

	// 6th request should be rate limited
	req := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
	rr := testutil.CreateTestResponseRecorder()
	middleware.ServeHTTP(rr, req)

	testutil.AssertStatusCode(t, rr, http.StatusTooManyRequests)
}

func TestRateLimit_Headers_Success(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)

	req := testutil.CreateTestRequestWithIP("GET", "/", "192.168.1.1:12345", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	testutil.AssertStatusCode(t, rr, http.StatusOK)
	assert.Equal(t, "10", rr.Header().Get("X-RateLimit-Limit"))
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Remaining")
	testutil.AssertHeaderExists(t, rr, "X-RateLimit-Reset")
}

func TestRateLimit_Headers_RateLimited(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(1), 1)
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)
	ip := "192.168.1.1:12345"

	// First request succeeds
	req1 := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
	rr1 := testutil.CreateTestResponseRecorder()
	middleware.ServeHTTP(rr1, req1)
	testutil.AssertStatusCode(t, rr1, http.StatusOK)

	// Second request gets rate limited
	req2 := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
	rr2 := testutil.CreateTestResponseRecorder()
	middleware.ServeHTTP(rr2, req2)

	testutil.AssertStatusCode(t, rr2, http.StatusTooManyRequests)
	assert.Equal(t, "10", rr2.Header().Get("X-RateLimit-Limit"))
	assert.Equal(t, "0", rr2.Header().Get("X-RateLimit-Remaining"))
	assert.Equal(t, "1", rr2.Header().Get("Retry-After"))
	testutil.AssertHeaderExists(t, rr2, "X-RateLimit-Reset")
}

func TestRateLimit_CallsNextHandler(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(10), 20)
	rateLimiterInstance = rl

	nextCalled := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCalled = true
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "Success")
	})

	middleware := RateLimit(handler)

	req := testutil.CreateTestRequestWithIP("GET", "/", "192.168.1.1:12345", nil)
	rr := testutil.CreateTestResponseRecorder()

	middleware.ServeHTTP(rr, req)

	assert.True(t, nextCalled, "Next handler should be called")
	testutil.AssertBodyContains(t, rr, "Success")
}

func TestRateLimit_ConcurrentRequests(t *testing.T) {
	rl := newRateLimiterWithConfig(rate.Limit(100), 200)
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)

	var wg sync.WaitGroup
	numRequests := 50

	for i := 0; i < numRequests; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()

			ip := fmt.Sprintf("192.168.1.%d:12345", id)
			req := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
			rr := testutil.CreateTestResponseRecorder()

			middleware.ServeHTTP(rr, req)

			assert.Equal(t, http.StatusOK, rr.Code)
		}(i)
	}

	wg.Wait()
}

// Benchmark Tests

func BenchmarkRateLimit_SingleIP(b *testing.B) {
	rl := newRateLimiterWithConfig(rate.Limit(1000), 2000)
	rateLimiterInstance = rl

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := RateLimit(handler)
	ip := "192.168.1.1:12345"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := testutil.CreateTestRequestWithIP("GET", "/", ip, nil)
		rr := testutil.CreateTestResponseRecorder()
		middleware.ServeHTTP(rr, req)
	}
}

func BenchmarkGetLimiter_ExistingIP(b *testing.B) {
	rl := newRateLimiterWithConfig(rate.Limit(100), 200)
	ip := "192.168.1.1"

	// Pre-create the limiter
	rl.getLimiter(ip)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		rl.getLimiter(ip)
	}
}

func BenchmarkGetLimiter_NewIP(b *testing.B) {
	rl := newRateLimiterWithConfig(rate.Limit(100), 200)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		b.StopTimer()
		ip := fmt.Sprintf("192.168.1.%d", i)
		b.StartTimer()

		rl.getLimiter(ip)
	}
}
