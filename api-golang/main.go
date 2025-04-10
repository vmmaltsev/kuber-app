package main

import (
	"log"
	"net/http"
	"os"

	"api-golang/database"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	databaseURL := getDatabaseURL()
	db, err := database.InitDB(databaseURL)
	if err != nil {
		log.Fatalf("⛔ Failed to initialize database: %v", err)
	}
	log.Println("✅ DATABASE CONNECTED")

	startServer(db)
}

func getDatabaseURL() string {
	if envURL := os.Getenv("DATABASE_URL"); envURL != "" {
		return envURL
	}
	if filePath := os.Getenv("DATABASE_URL_FILE"); filePath != "" {
		content, err := os.ReadFile(filePath)
		if err != nil {
			log.Fatalf("❌ Failed to read DATABASE_URL_FILE: %v", err)
		}
		return string(content)
	}
	log.Fatal("❌ DATABASE_URL or DATABASE_URL_FILE must be set")
	return ""
}

func startServer(db *database.Database) {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		ctx := c.Request.Context()

		if err := db.InsertView(ctx); err != nil {
			log.Printf("❌ InsertView failed: %v", err)
			c.JSON(500, gin.H{"error": "Insert failed"})
			return
		}

		tm, reqCount, err := db.GetTimeAndRequestCount(ctx)
		if err != nil {
			log.Printf("❌ GetTimeAndRequestCount failed: %v", err)
			c.JSON(500, gin.H{"error": "Query failed"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"api":          "go",
			"currentTime":  tm,
			"requestCount": reqCount,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, "pong")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Printf("🚀 Starting server on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
