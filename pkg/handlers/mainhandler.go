package handlers

import (
	"fmt"
	"forum/pkg/db"
	"forum/pkg/models"
	"html/template"
	"log"
	"net/http"
	"time"
)

var Templates = template.Must(template.ParseGlob("web/templates/*.html"))

func MainHandler(w http.ResponseWriter, r *http.Request) {
	var user *models.User

	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, redirect to the login page
			user := &models.User{IsLoggedIn: false}
			pageData := models.PostPageData{
				User: *user,
				Post: []models.Post{},
			}
			if err := Templates.ExecuteTemplate(w, "index.html", pageData); err != nil {
				log.Fatal(err)
			}
			return
		}
		log.Fatal(err)
		// For any other type of error, return a bad request status
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	user, err = SessionHandler(cookie.Value)
	if err != nil {
		log.Println("Error retrieving user from session:", err)
		log.Fatal(err)
	}

	var posts []models.Post
	query := `
	SELECT p.post_id, p.title, p.content, p.created_at, u.id, u.username, u.email, u.img_url
	FROM posts p
	JOIN users u ON p.user_id = u.id
`
	rows, err := db.DataBase.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var post models.Post
		var postUser models.User
		var createdAtStr string
		err := rows.Scan(&post.PostID, &post.Title, &post.Content, &createdAtStr, &postUser.UserID, &postUser.Username, &postUser.Email, &postUser.ImgURL)
		if err != nil {
			log.Fatal(err)
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

		post.User = postUser
		post.CreatedAt = formattedCreatedAt
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

	pageData := models.PostPageData{
		User: *user,
		Post: posts,
	}

	if err := Templates.ExecuteTemplate(w, "index.html", pageData); err != nil {
		log.Fatal(err)
	}
}
