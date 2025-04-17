package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

// InitDB initializes a new pgxpool and returns Database wrapper
func InitDB(connString string) (*Database, error) {
	pool, err := pgxpool.New(context.Background(), connString)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database pool: %w", err)
	}

	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return &Database{Pool: pool}, nil
}

// InsertView inserts an entry into the request table
func (db *Database) InsertView(ctx context.Context) error {
	_, err := db.Pool.Exec(ctx, "INSERT INTO request (api_name) VALUES ($1);", "go")
	return err
}

// GetTimeAndRequestCount returns current time and number of requests
func (db *Database) GetTimeAndRequestCount(ctx context.Context) (time.Time, int, error) {
	var tm time.Time
	var reqCount int

	err := db.Pool.QueryRow(ctx,
		"SELECT NOW() AS current_time, COUNT(*) AS request_count FROM request WHERE api_name = $1;",
		"go",
	).Scan(&tm, &reqCount)

	if err != nil {
		return time.Time{}, 0, err
	}

	return tm, reqCount, nil
}
