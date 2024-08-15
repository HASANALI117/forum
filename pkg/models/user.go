package models

type User struct {
	UserID     int
	Email      string
	Username   string
	ImgURL     string
	CreatedAt  string
	IsLoggedIn bool
}

type Post struct {
	PostID    int
	User      User
	Title     string
	Content   string
	CreatedAt string
}

type PostPageData struct {
	User User
	Post []Post
}
