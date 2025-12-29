# Agent Guide for md-api

## Project Overview

This is a monorepo with a Go backend API and Next.js frontend for event management, consuming the Ticketmaster API. The project uses OpenAPI for type generation across both backend and frontend.

## Project Structure

```
md-api/
├── apps/
│   ├── backend/     # Go API server (port 8080)
│   └── frontend/    # Next.js app (port 3000)
├── openapi/         # OpenAPI schema definitions
└── scripts at root  # generate-types.sh, start.sh
```

## Build, Lint, and Test Commands

### Backend (Go)

```bash
# From apps/backend/
go run main.go                           # Run server
go build -o bin/api                      # Build binary
go test ./...                            # Run all tests
go test ./...  -cover                    # Run tests with coverage
go test ./api/middleware -v              # Run tests for specific package
go test -run TestFunctionName ./...      # Run single test by name
go test -bench=. ./...                   # Run benchmark tests
go generate                              # Generate OpenAPI types

# Coverage Reports
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out         # View coverage in browser
go tool cover -func=coverage.out         # View coverage by function

# Linting
go fmt ./...                             # Format code
go vet ./...                             # Static analysis
```

### Frontend (Next.js)

```bash
# From apps/frontend/
pnpm dev                                 # Dev server with turbopack
pnpm build                               # Production build
pnpm start                               # Start production server
pnpm lint                                # Run ESLint
pnpm lint:fix                            # Auto-fix lint issues

# No test runner configured yet
```

### Root Commands

```bash
./start.sh                               # Start both backend and frontend
./generate-types.sh                      # Generate types from OpenAPI schema
```

## Code Style Guidelines

### Go Backend

**Package Structure:**
- Each package should have a clear, single responsibility
- Use lowercase package names (e.g., `handler`, `middleware`, `service`)
- Package names should match directory names

**Import Order:**
```go
import (
    "standard/library"      // Standard library first
    
    "md-api/internal/pkg"   // Internal packages second
    
    "github.com/external"   // External packages last
)
```

**Naming Conventions:**
- Use `camelCase` for private functions/variables: `mustLoadEnvs()`, `fetch()`
- Use `PascalCase` for exported functions/types: `Listen()`, `Service`, `Fetcher`
- Use descriptive names: `JWTAuth`, `TicketMasterApiUrl`
- Constants use `PascalCase`: `Port`, `Environment`, `MB`

**Error Handling:**
```go
// Return errors, don't panic in library code
if err != nil {
    return fmt.Errorf("descriptive message: %w", err)
}

// Panic only for unrecoverable startup errors
if val == "" {
    panic(string(key) + " env variable is empty")
}
```

**Interfaces:**
- Define interfaces at the point of use
- Keep interfaces small (1-3 methods)
- Use `-er` suffix for single-method interfaces: `Fetcher`

**HTTP Handlers:**
```go
func HandlerName(w http.ResponseWriter, r *http.Request) {
    // Use middleware.Chain for composing middleware
    // Return early on errors with http.Error
    // Set Content-Type headers explicitly
}
```

**Type Safety:**
- Use type aliases for semantic clarity: `type envVar string`
- Avoid `interface{}` where possible
- Use struct embedding for composition

### TypeScript/React Frontend

**Import Order:**
```typescript
// React/Next.js imports first
import { useState } from "react";
import type { Metadata } from "next";

// Third-party libraries
import { useSuspenseQuery } from "@tanstack/react-query";

// Internal imports (alphabetically sorted)
import { apiClient } from "@/lib/client";
import { getEvents } from "@/lib/events/getEvents";
import type { Event } from "@/lib/types";
```

**ESLint Rules (enforced):**
- Double quotes for strings: `"hello"`
- Semicolons required: `const x = 1;`
- Trailing commas: `{ a, b, }`
- Tab width: 2 spaces
- Alphabetize imports (case-sensitive)
- `@typescript-eslint/no-explicit-any`: warn

**Naming Conventions:**
- Components: `PascalCase` - `EventCard`, `SearchBoard`
- Files: `camelCase.tsx` - `eventCard/index.tsx`
- Functions/variables: `camelCase` - `getEvents`, `formatQuery`
- Types: `PascalCase` - `Ticketmaster`, `Event`
- React hooks: `use` prefix - `useFocusTrap`

**Component Patterns:**
```typescript
// Use type for props
type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

// Default export for page/route components
export default function ComponentName({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}

// Named exports for utilities
export async function getEvents(opts: Opts) { ... }
```

**Type Definitions:**
- Import from generated schema: `import { components } from "@/schema";`
- Extract types from schema: `type Event = Schemas["Event"];`
- Use `Readonly<>` for immutable props
- Mark optional with `?`: `className?: string`

**Error Handling:**
```typescript
try {
  const { data, error } = await apiClient.GET("/events");
  if (error) throw error;
  return data;
} catch (err) {
  throw new Error("descriptive message", { cause: err });
}
```

**Server Actions:**
- Mark with `"use server"` directive
- Always validate environment variables
- Use typed OpenAPI client

**Client Components:**
- Mark with `"use client"` directive
- Use React Query for data fetching
- Implement proper loading states

## Type Generation

The project uses OpenAPI as the single source of truth:

1. Edit `openapi/api.yaml`
2. Run `./generate-types.sh` to generate:
   - Go types: `apps/backend/model/openapi.gen.go`
   - TypeScript types: `apps/frontend/schema.d.ts`
3. Import generated types in both backend and frontend

## Environment Variables

Required `.env` in `apps/backend/`:
- `ENVIRONMENT`, `PORT`
- `JWT_SECRET`
- `TICKETMASTER_API_URL`, `TICKETMASTER_API_KEY`, `TICKETMASTER_API_SECRET`

Access via `env.VariableName.Get()` - panics if missing/empty.

## Common Patterns

### Go Middleware Chaining
```go
mux.HandleFunc("GET /path", middleware.Chain(
    middleware.JWTAuth,
    middleware.Logger,
    middleware.Cors,
)(handler.Handler))
```

### React Query Usage
```typescript
const { data, isFetching } = useSuspenseQuery({
  queryKey: ["events", query],
  queryFn: () => getEvents(query),
});
```

### OpenAPI Client (Frontend)
```typescript
const { data, error, response } = await apiClient.GET("/events", {
  headers: { Authorization: `Bearer ${token}` },
  params: { query: { ... } },
});
```

## Notes for Agents

- Always run `./generate-types.sh` after modifying `openapi/api.yaml`
- Backend uses standard library HTTP server (no framework)
- Frontend uses Next.js App Router with Server Actions
- Use `pnpm` for frontend package management
- Backend uses Go 1.24.5 with modules

## Testing Guidelines

### Backend Testing (Go)

**Test Structure:**
- Test files end with `_test.go`
- Place test files next to the code they test
- Use `testutil` package for shared test utilities
- Current test coverage: **89.2%** for middleware

**Test Utilities:**
```go
import "md-api/testutil"

// JWT Token Generation
token, _ := testutil.GenerateTestToken(secret, 24*time.Hour)
expiredToken, _ := testutil.GenerateExpiredToken(secret)
invalidAudToken, _ := testutil.GenerateInvalidAudienceToken(secret)

// HTTP Testing Helpers
req := testutil.CreateTestRequest("GET", "/path", &token)
req := testutil.CreateTestRequestWithIP("GET", "/", "192.168.1.1:8080", &token)
rr := testutil.CreateTestResponseRecorder()

// Assertions
testutil.AssertStatusCode(t, rr, http.StatusOK)
testutil.AssertHeader(t, rr, "Content-Type", "application/json")
testutil.AssertHeaderExists(t, rr, "X-RateLimit-Limit")
testutil.AssertBodyContains(t, rr, "expected text")

// Environment Setup
testutil.SetupTestEnv(t)  // Sets up all required env vars for tests
```

**Testing Patterns:**

```go
// Unit Test Pattern
func TestFunctionName(t *testing.T) {
    // Arrange
    input := "test"
    
    // Act
    result := FunctionToTest(input)
    
    // Assert
    assert.Equal(t, "expected", result)
}

// Table-Driven Tests
func TestMultipleCases(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected string
    }{
        {"case1", "input1", "output1"},
        {"case2", "input2", "output2"},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Function(tt.input)
            assert.Equal(t, tt.expected, result)
        })
    }
}

// Middleware Testing Pattern
func TestMiddleware(t *testing.T) {
    handlerCalled := false
    handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        handlerCalled = true
        w.WriteHeader(http.StatusOK)
    })
    
    middleware := YourMiddleware(handler)
    
    req := testutil.CreateTestRequest("GET", "/", nil)
    rr := testutil.CreateTestResponseRecorder()
    
    middleware.ServeHTTP(rr, req)
    
    assert.True(t, handlerCalled)
    testutil.AssertStatusCode(t, rr, http.StatusOK)
}
```

**Coverage Goals:**
- Critical security code (auth, rate limiting): **90%+**
- Business logic: **80%+**
- Utilities: **70%+**
- Total project: **80%+**

**Testing Checklist:**
- ✅ Test happy path (success cases)
- ✅ Test error cases (validation failures, auth failures)
- ✅ Test edge cases (empty input, nil values, boundaries)
- ✅ Test concurrency (if code uses goroutines)
- ✅ Test middleware chains work correctly
- ✅ Use table-driven tests for multiple similar cases

**Generate JWT Tokens for Testing:**
```bash
# CLI tool for generating test tokens
cd apps/backend
go run tools/generate-token.go
```

**Benchmark Tests:**
```go
func BenchmarkFunctionName(b *testing.B) {
    for i := 0; i < b.N; i++ {
        FunctionToTest()
    }
}
```

**Mock External Dependencies:**
- Use interfaces for external dependencies
- Create mock implementations for testing
- Use `testutil` for common mocks (JWT tokens, HTTP requests)

### Current Test Suite

**Test Files:**
- `testutil/auth_test.go` - JWT token generation tests (6 tests)
- `api/middleware/ratelimiter_test.go` - Rate limiter unit & integration tests (24 tests)
- `api/middleware/middlewares_test.go` - JWT, Logger, Cors, Chain tests (21 tests)

**Total: 51 tests across all packages**

**Package Coverage:**
- `api/middleware`: **89.2%** ✅
- `testutil`: **30.8%** (utilities package)
