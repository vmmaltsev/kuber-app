package service

import (
	"context"
	"time"
)

type RequestRepository interface {
	InsertView(ctx context.Context) error
	GetTimeAndRequestCount(ctx context.Context) (time.Time, int, error)
}

type RequestService struct {
	repo RequestRepository
}

func NewRequestService(repo RequestRepository) *RequestService {
	return &RequestService{repo: repo}
}

func (s *RequestService) RegisterView(ctx context.Context) error {
	return s.repo.InsertView(ctx)
}

func (s *RequestService) GetStats(ctx context.Context) (time.Time, int, error) {
	return s.repo.GetTimeAndRequestCount(ctx)
} 