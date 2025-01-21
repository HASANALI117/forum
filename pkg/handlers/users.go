package handlers

import (
	"encoding/json"
	"net/http"

	helpers "forum/pkg/helpers"
	database "forum/pkg/db"
	ws "forum/pkg/websockets"
)

// func GetCurrentUser(db *database.DBWrapper, r *http.Request) (*models.User, error) {
// 	cookie, err := r.Cookie("session_token")
// 	if (err != nil) {
// 		return nil, err
// 	}
// 	user, err := helpers.GetUserBySession(db.DB.DBConn, cookie.Value)
// 	return user, err
// }

// The online users or user list
func GetUsersListHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		usrs, err := helpers.GetAllUsers(db.DB.DBConn)
		if err != nil {
			helpers.Error(w, "Could not get users", http.StatusInternalServerError, err)
			return
		}
		json.NewEncoder(w).Encode(usrs)
	}, db)
}

func OnlineUsersHandler(h *ws.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		users := h.GetOnlineUsers()
		data, _ := json.Marshal(users)
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
	}
}
