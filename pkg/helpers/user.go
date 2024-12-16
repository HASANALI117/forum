
package helpers

import (
	"database/sql"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	models "forum/pkg/models"
)

// Register a new user
func RegisterUser(db *sql.DB, user models.User) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.ID = uuid.New().String()
	user.Password = string(hashed)

	_, err = db.Exec(`INSERT INTO users(id, nickname, email, password, age, gender, first_name, last_name)
	VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
		user.ID, user.Nickname, user.Email, user.Password, user.Age, user.Gender, user.FirstName, user.LastName)
	return err
}

// Authenticate user by nickname or email
func AuthenticateUser(db *sql.DB, identifier, password string) (*models.User, error) {
	row := db.QueryRow(`SELECT id, nickname, email, password, age, gender, first_name, last_name FROM users
		WHERE nickname = ? OR email = ?`, identifier, identifier)
	u := models.User{}
	var hashed string
	err := row.Scan(&u.ID, &u.Nickname, &u.Email, &hashed, &u.Age, &u.Gender, &u.FirstName, &u.LastName)
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
	rows, err := db.Query(`SELECT id, nickname, email, password, age, gender, first_name, last_name FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var usrs []models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(&u.ID, &u.Nickname, &u.Email, &u.Password, &u.Age, &u.Gender, &u.FirstName, &u.LastName)
		if err != nil {
			return nil, err
		}
		usrs = append(usrs, u)
	}
	return usrs, nil
}