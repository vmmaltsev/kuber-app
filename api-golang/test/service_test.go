package test

import (
	"context"
	"errors"
	"testing"
	"time"

	"api-golang/internal/service"
)

type mockRepo struct {
	insertErr error
	statsErr  error
}

func (m *mockRepo) InsertView(ctx context.Context) error {
	return m.insertErr
}

func (m *mockRepo) GetTimeAndRequestCount(ctx context.Context) (time.Time, int, error) {
	if m.statsErr != nil {
		return time.Time{}, 0, m.statsErr
	}
	return time.Now(), 99, nil
}

func TestRegisterView(t *testing.T) {
	svc := service.NewRequestService(&mockRepo{})
	err := svc.RegisterView(context.Background())
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
}

func TestRegisterView_Error(t *testing.T) {
	svc := service.NewRequestService(&mockRepo{insertErr: errors.New("fail")})
	err := svc.RegisterView(context.Background())
	if err == nil {
		t.Error("expected error, got nil")
	}
}

func TestGetStats(t *testing.T) {
	svc := service.NewRequestService(&mockRepo{})
	_, count, err := svc.GetStats(context.Background())
	if err != nil || count != 99 {
		t.Errorf("unexpected result: %v, %d", err, count)
	}
}

func TestGetStats_Error(t *testing.T) {
	svc := service.NewRequestService(&mockRepo{statsErr: errors.New("fail")})
	_, _, err := svc.GetStats(context.Background())
	if err == nil {
		t.Error("expected error, got nil")
	}
} 