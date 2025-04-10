package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	port, exists := os.LookupEnv("PORT")
	if !exists {
		port = "8000"
	}

	url := fmt.Sprintf("http://localhost:%s/ping", port)
	client := http.Client{
		Timeout: 2 * time.Second,
	}

	log.Printf("📡 Sending GET request to %s", url)
	resp, err := client.Get(url)
	if err != nil {
		log.Fatalf("❌ Request failed: %v", err)
	}
	defer resp.Body.Close()

	fmt.Printf("✅ HTTP Response Status: %d %s\n", resp.StatusCode, http.StatusText(resp.StatusCode))

	if resp.StatusCode >= 200 && resp.StatusCode <= 299 {
		log.Println("✅ Service is healthy")
		os.Exit(0)
	} else {
		log.Println("🔴 Service unhealthy, non-2xx response")
		os.Exit(1)
	}
}
