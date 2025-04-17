package test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"api-golang/handlers"
	"api-golang/internal/service"
)

type mockService struct{}

func (m *mockService) RegisterView(ctx context.Context) error { return nil }
func (m *mockService) GetStats(ctx context.Context) (time.Time, int, error) {
	return time.Now(), 42, nil
}

func TestPingEndpoint(t *testing.T) {
	svc := &mockService{}
	r := handlers.SetupRouter(svc)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestRootEndpoint(t *testing.T) {
	svc := &mockService{}
	r := handlers.SetupRouter(svc)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
} 