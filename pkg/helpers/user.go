package helpers

import (
	"database/sql"
	"fmt"
	database "forum/pkg/db"
	models "forum/pkg/models"
	"math/rand"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Register a new user
func RegisterUser(db *sql.DB, user *models.User) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.ID = uuid.New().String()
	user.Password = string(hashed)

	// Assign a random image URL
	user.Image = fmt.Sprintf("https://picsum.photos/id/%d/200/300", rand.New(rand.NewSource(time.Now().UnixNano())).Intn(1001))

	_, err = db.Exec(`INSERT INTO users(id, username, email, password, age, gender, first_name, last_name, image)
	VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,

		user.ID, user.Username, user.Email, user.Password, user.Age, user.Gender, user.FirstName, user.LastName, user.Image)
	if err != nil {
		return err
	}
	return nil
}

// Authenticate user by nickname or email
func AuthenticateUser(db *sql.DB, identifier, password string) (*models.User, error) {
	row := db.QueryRow(`SELECT id, username, email, password, age, gender, first_name, last_name FROM users
		WHERE username = ? OR email = ?`, identifier, identifier)
	u := models.User{}
	var hashed string
	err := row.Scan(&u.ID, &u.Username, &u.Email, &hashed, &u.Age, &u.Gender, &u.FirstName, &u.LastName)
	if err != nil {
		return nil, err
	}

	if bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password)) != nil {
		return nil, sql.ErrNoRows
	}
	return &u, nil
}

// Get all users for sidebar listing
func GetAllUsers(db *sql.DB) ([]models.User, error) {
	rows, err := db.Query(`SELECT id, username, email, password, age, gender, first_name, last_name, image FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var usrs []models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Age, &u.Gender, &u.FirstName, &u.LastName, &u.Image)
		if err != nil {
			return nil, err
		}
		usrs = append(usrs, u)
	}
	return usrs, nil
}

func GetCurrentUser(db *database.DBWrapper, r *http.Request) (*models.User, error) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return nil, err
	}
	user, err := GetUserBySession(db.DB.DBConn, cookie.Value)
	return user, err
}

func GetUsersWithChatHistory(db *sql.DB, userID string) ([]models.User, error) {
	query := `
		SELECT DISTINCT u.id, u.username, u.email, u.password, u.age, u.gender, u.first_name, u.last_name, u.image 
		FROM users u 
		INNER JOIN messages m 
		ON (u.id = m.sender_id OR u.id = m.receiver_id)
		WHERE (m.sender_id = ? OR m.receiver_id = ?)
		AND u.id != ?`

	rows, err := db.Query(query, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Age, &u.Gender, &u.FirstName, &u.LastName, &u.Image)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}
