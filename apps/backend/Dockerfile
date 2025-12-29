# syntax=docker/dockerfile:1

# Build stage
FROM golang:1.24.5 AS builder
WORKDIR /app

# Copy dependency files and download dependencies
COPY go.mod go.sum ./
RUN go mod download
# Copy all source code
COPY . .

# Build the application - build the package, not just main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/api .

# Runtime stage
FROM alpine:latest
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 goapp && \
    adduser --system --uid 1001 --ingroup goapp goapp

# Copy the binary from builder stage
COPY --from=builder --chown=goapp:goapp /app/bin/api ./api

USER goapp

# Expose the port
EXPOSE 8080

# Run the application
CMD ["./api"]
