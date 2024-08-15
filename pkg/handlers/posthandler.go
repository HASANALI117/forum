package handlers

import (
	"fmt"
	"forum/pkg/db"
	"forum/pkg/models"
	"log"
	"net/http"
	"time"
)

func PostHandler(w http.ResponseWriter, r *http.Request) {
	var user *models.User
	cookie, err := r.Cookie("session_token")
	if err == nil {
		user, err = SessionHandler(cookie.Value)
		if err != nil {
			log.Println("Error retrieving user from session:", err)
		}
	}

	title := r.FormValue("title")
	content := r.FormValue("content")

	_, err = db.DataBase.Exec("INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)", user.UserID, title, content, time.Now())
	if err != nil {
		log.Fatal(err)
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func RenderPostFormHandler(w http.ResponseWriter, r *http.Request) {
	if err := Templates.ExecuteTemplate(w, "postform.html", ""); err != nil {
		log.Fatal(err)
	}
}

func FetchPosts(user *models.User) models.PostPageData {
	var posts []models.Post
	query := `
	SELECT p.post_id, p.title, p.content, p.created_at, u.id, u.username, u.email, u.img_url
	FROM posts p
	JOIN users u ON p.user_id = u.id
	ORDER BY p.created_at DESC
`
	rows, err := db.DataBase.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var post models.Post
		var user models.User
		err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &user.UserID, &user.Username, &user.Email, &user.ImgURL)
		if err != nil {
			log.Fatal(err)
		}

		// Parse the createdAt string to time.Time
		createdAt, err := time.Parse(time.RFC3339, post.CreatedAt)
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

		post.User = user
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

	return pageData
}
