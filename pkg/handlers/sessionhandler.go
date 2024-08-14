package handlers

import (
	"fmt"
	"forum/pkg/db"
	"forum/pkg/models"
	"log"
	"time"
)

func SessionHandler(sessionToken string) (*models.User, error) {
	var userID int
	var username, email, imgUrl, createdAtStr string

	err := db.DataBase.QueryRow("SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > ?", sessionToken, time.Now()).Scan(&userID)
	if err != nil {
		log.Fatal(err)
		return &models.User{IsLoggedIn: false}, nil
	}

	err = db.DataBase.QueryRow("SELECT username, email, img_url, created_at FROM users WHERE id = ?", userID).Scan(&username, &email, &imgUrl, &createdAtStr)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	// Parse the createdAt string to time.Time
	createdAt, err := time.Parse(time.RFC3339, createdAtStr)
	if err != nil {
		log.Fatal(err)
	}

	// Calculate the duration since createdAt
	duration := time.Since(createdAt)

	// Format the createdAt based on the duration
	var formattedCreatedAt string
	if duration.Hours() >= 1 {
		formattedCreatedAt = fmt.Sprintf("%.0fh", duration.Hours())
	} else if duration.Minutes() >= 1 {
		formattedCreatedAt = fmt.Sprintf("%.0fm", duration.Minutes())
	} else {
		formattedCreatedAt = fmt.Sprintf("%.0fs", duration.Seconds())
	}

	user := &models.User{
		Username:   username,
		Email:      email,
		ImgURL:     imgUrl,
		CreatedAt:  formattedCreatedAt,
		IsLoggedIn: true,
	}

	return user, nil
}
