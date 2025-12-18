# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./

# Copy source code
COPY main.go ./

# Build the application
RUN go build -o main .

# Run stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .

# Create data directory
RUN mkdir -p data

# Copy initial portfolio data
COPY data/portfolio.json ./data/

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"]
