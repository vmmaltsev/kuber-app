package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"api-golang/internal/service"
	"github.com/rs/zerolog/log"
)

func SetupRouter(svc *service.RequestService) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	r.GET("/", func(c *gin.Context) {
		ctx := c.Request.Context()
		if err := svc.RegisterView(ctx); err != nil {
			log.Error().Err(err).Msg("RegisterView failed")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Insert failed"})
			return
		}
		tm, reqCount, err := svc.GetStats(ctx)
		if err != nil {
			log.Error().Err(err).Msg("GetStats failed")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"api":          "go",
			"currentTime":  tm,
			"requestCount": reqCount,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	return r
} 