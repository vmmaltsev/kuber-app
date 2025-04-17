package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"api-golang/database"
	"api-golang/internal/service"
	"api-golang/handlers"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	"github.com/rs/zerolog/log"
)

type Config struct {
	Port        string `envconfig:"PORT" default:"8000"`
	DatabaseURL string `envconfig:"DATABASE_URL"`
	DatabaseURLFile string `envconfig:"DATABASE_URL_FILE"`
}

func main() {
	_ = godotenv.Load()

	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		log.Fatal().Err(err).Msg("Failed to load config")
	}

	databaseURL := getDatabaseURL(cfg)
	db, err := database.InitDB(databaseURL)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to initialize database")
	}
	log.Info().Msg("DATABASE CONNECTED")

	svc := service.NewRequestService(db)
	r := handlers.SetupRouter(svc)

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-quit
		log.Info().Msg("Shutting down server...")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := srv.Shutdown(ctx); err != nil {
			log.Error().Err(err).Msg("Server forced to shutdown")
		}
	}()

	log.Info().Msgf("Starting server on port %s...", cfg.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal().Err(err).Msg("Failed to start server")
	}
}

func getDatabaseURL(cfg Config) string {
	if cfg.DatabaseURL != "" {
		return cfg.DatabaseURL
	}
	if cfg.DatabaseURLFile != "" {
		content, err := os.ReadFile(cfg.DatabaseURLFile)
		if err != nil {
			log.Fatal().Err(err).Msg("Failed to read DATABASE_URL_FILE")
		}
		return string(content)
	}
	log.Fatal().Msg("DATABASE_URL or DATABASE_URL_FILE must be set")
	return ""
}
