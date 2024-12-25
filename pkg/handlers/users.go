package handlers

import (
	"encoding/json"
	"net/http"

	helpers "forum/pkg/helpers"
	models "forum/pkg/models"
	database "forum/pkg/db"
)

func GetCurrentUser(db *database.DBWrapper, r *http.Request) (*models.User, error) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return nil, err
	}
	user, err := helpers.GetUserBySession(db.DB.DBConn, cookie.Value)
	return user, err
}

// The online users or user list
func GetUsersListHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		usrs, err := helpers.GetAllUsers(db.DB.DBConn)
		if err != nil {
			http.Error(w, "Could not get users", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(usrs)
	}, db)
}
