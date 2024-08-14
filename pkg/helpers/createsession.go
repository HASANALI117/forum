package helpers

import (
	"forum/pkg/db"
	"time"

	"github.com/gofrs/uuid"
)

func CreateSession(userID int) (string, time.Time, error) {
	sessionToken, err := uuid.NewV4()
	if err != nil {
		return "", time.Time{}, err
	}

	expiresAt := time.Now().Add(24 * time.Hour)
	_, err = db.DataBase.Exec("INSERT INTO sessions (session_token, user_id, expires_at) VALUES (?, ?, ?)", sessionToken.String(), userID, expiresAt)
	if err != nil {
		return "", time.Time{}, err
	}

	return sessionToken.String(), expiresAt, nil
}
