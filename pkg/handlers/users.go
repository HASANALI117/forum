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

func OnlineUsersHandler(h *ws.Hub, db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		currentUser, err := helpers.GetCurrentUser(db, r)
		if (err != nil) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Get online users
		onlineUsers := h.GetOnlineUsers()
		
		// Get users with chat history
		historyUsers, err := helpers.GetUsersWithChatHistory(db.DB.DBConn, currentUser.ID)
		if err != nil {
			http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
			return
		}

		// Create a map to store unique users
		uniqueUsers := make(map[string]map[string]string)

		// Add online users to map
		for _, user := range onlineUsers {
			uniqueUsers[user["id"]] = map[string]string{
				"id":       user["id"],
				"username": user["username"],
				"status":   "online",
			}
		}

		// Add history users to map
		for _, user := range historyUsers {
			if _, exists := uniqueUsers[user.ID]; !exists {
				uniqueUsers[user.ID] = map[string]string{
					"id":       user.ID,
					"username": user.Username,
					"status":   "offline",
				}
			}
		}

		// Convert map to slice
		result := make([]map[string]string, 0, len(uniqueUsers))
		for _, user := range uniqueUsers {
			result = append(result, user)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}
