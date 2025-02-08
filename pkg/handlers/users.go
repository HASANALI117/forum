package handlers

import (
	"encoding/json"
	"net/http"

	database "forum/pkg/db"
	helpers "forum/pkg/helpers"
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
		if err != nil {
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
				"image":    user["image"],
				"status":   "online",
			}
		}

		// Add history users to map
		for _, user := range historyUsers {
			if _, exists := uniqueUsers[user.ID]; !exists {
				uniqueUsers[user.ID] = map[string]string{
					"id":       user.ID,
					"username": user.Username,
					"image":    user.Image,
					"status":   "offline",
				}
			}
		}

		// Get all registered users and add them if not already present
		allUsers, err := helpers.GetAllUsers(db.DB.DBConn)
		if err != nil {
			http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
			return
		}

		// Add remaining users as offline
		for _, user := range allUsers {
			// Skip current user
			if user.ID == currentUser.ID {
				continue
			}
			if _, exists := uniqueUsers[user.ID]; !exists {
				uniqueUsers[user.ID] = map[string]string{
					"id":       user.ID,
					"username": user.Username,
					"image":    user.Image,
					"status":   "offline",
				}
			}
		}

		// Get latest messages for each user
		result := make([]map[string]interface{}, 0, len(uniqueUsers))
		for _, user := range uniqueUsers {
			userData := map[string]interface{}{
				"id":       user["id"],
				"username": user["username"],
				"image":    user["image"],
				"status":   user["status"],
			}

			// Get latest message between current user and this user
			latestMsg, err := helpers.GetLatestMessageBetweenUsers(db.DB.DBConn, currentUser.ID, user["id"])
			if err != nil {
				http.Error(w, "Failed to fetch messages", http.StatusInternalServerError)
				return
			}

			if latestMsg != nil {
				userData["lastMessage"] = map[string]interface{}{
					"content":      latestMsg.Content,
					"sender_id":    latestMsg.SenderID,
					"created_at":   latestMsg.CreatedAt,
					"sender_name":  latestMsg.SenderName,
					"sender_image": latestMsg.SenderImage,
				}
			}

			result = append(result, userData)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}
