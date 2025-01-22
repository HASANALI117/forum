package helpers

import (
	"database/sql"
	models "forum/pkg/models"

	"github.com/google/uuid"
)

func CreateSession(db *sql.DB, userID string) (string, error) {
	sessionToken := uuid.New().String()
	_, err := db.Exec(`INSERT INTO sessions(session_token, user_id) VALUES(?, ?)`, sessionToken, userID)
	return sessionToken, err
}

func GetUserBySession(db *sql.DB, token string) (*models.User, error) {
	row := db.QueryRow(`SELECT u.id, u.username, u.email, u.password, u.age, u.gender, u.first_name, u.last_name, u.image 
		FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ?`, token)
	u := models.User{}
	err := row.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Age, &u.Gender, &u.FirstName, &u.LastName, &u.Image)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func DeleteSession(db *sql.DB, token string) error {
	_, err := db.Exec(`DELETE FROM sessions WHERE session_token = ?`, token)
	return err
}
