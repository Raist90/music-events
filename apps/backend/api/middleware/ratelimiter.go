package middleware

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// rateLimiter provides per-IP rate limiting with automatic cleanup
type rateLimiter struct {
	limiters map[string]*rate.Limiter // IP -> limiter mapping
	visitors map[string]time.Time     // IP -> last seen timestamp
	mu       sync.RWMutex             // Protects concurrent access
	rps      rate.Limit               // Requests per second
	burst    int                      // Burst capacity
}

// newRateLimiter creates a new rate limiter with hardcoded values:
// - 10 requests per second per IP
// - Burst capacity of 20 requests
func newRateLimiter() *rateLimiter {
	return newRateLimiterWithConfig(rate.Limit(10), 20)
}

// newRateLimiterWithConfig creates a rate limiter with custom configuration.
// Useful for testing with different rate limits.
func newRateLimiterWithConfig(rps rate.Limit, burst int) *rateLimiter {
	rl := &rateLimiter{
		limiters: make(map[string]*rate.Limiter),
		visitors: make(map[string]time.Time),
		rps:      rps,
		burst:    burst,
	}
	return rl
}

// getLimiter returns the rate limiter for the given IP address.
// Creates a new limiter if one doesn't exist for this IP.
func (rl *rateLimiter) getLimiter(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	// Update last seen time
	rl.visitors[ip] = time.Now()

	// Return existing limiter or create new one
	limiter, exists := rl.limiters[ip]
	if !exists {
		limiter = rate.NewLimiter(rl.rps, rl.burst)
		rl.limiters[ip] = limiter
	}

	return limiter
}

// cleanupStaleVisitors removes limiters for IPs that haven't been seen
// in the last 5 minutes. Runs as a background goroutine.
func (rl *rateLimiter) cleanupStaleVisitors() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.cleanupStaleVisitorsOnce(5 * time.Minute)
	}
}

// cleanupStaleVisitorsOnce performs a single cleanup pass.
// Exported for testing purposes.
func (rl *rateLimiter) cleanupStaleVisitorsOnce(staleThreshold time.Duration) int {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	removedCount := 0

	// Find and remove stale entries
	for ip, lastSeen := range rl.visitors {
		if now.Sub(lastSeen) > staleThreshold {
			delete(rl.visitors, ip)
			delete(rl.limiters, ip)
			removedCount++
		}
	}

	if removedCount > 0 {
		log.Printf("Rate limiter cleanup: removed %d stale IP(s)", removedCount)
	}

	return removedCount
}

// getClientIP extracts the client IP address from the request.
// Strips the port number if present (e.g., "127.0.0.1:12345" -> "127.0.0.1")
func getClientIP(r *http.Request) string {
	ip := r.RemoteAddr

	// Strip port if present
	if idx := strings.LastIndex(ip, ":"); idx != -1 {
		ip = ip[:idx]
	}

	return ip
}

// setRateLimitHeaders adds rate limit information headers to the response
func setRateLimitHeaders(w http.ResponseWriter, limiter *rate.Limiter) {
	tokens := limiter.Tokens()
	remaining := max(int(tokens), 0)

	resetTime := time.Now().Add(1 * time.Second).Unix()

	w.Header().Set("X-RateLimit-Limit", "10")
	w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))
	w.Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", resetTime))
}

var rateLimiterInstance *rateLimiter

// StartRateLimiterCleanup initializes the rate limiter and starts
// the background cleanup goroutine. Should be called once at server startup.
func StartRateLimiterCleanup() {
	if rateLimiterInstance == nil {
		rateLimiterInstance = newRateLimiter()
		go rateLimiterInstance.cleanupStaleVisitors()
		log.Println("Rate limiter initialized: 10 req/sec per IP, burst 20")
	}
}
