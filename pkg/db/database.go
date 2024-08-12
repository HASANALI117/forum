package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var DataBase *sql.DB

func InitDB() {
	var err error
	DataBase, err = sql.Open("sqlite3", "pkg/db/forum.db")
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	err = createTables(DataBase)
	if err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}

	if err = DataBase.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Println("Database initialized successfully")
}

func createTables(db *sql.DB) error {
	sqlFile, err := os.ReadFile("pkg/db/database.sql")
	if err != nil {
		return err
	}

	_, err = db.Exec(string(sqlFile))
	if err != nil {
		return err
	}

	log.Println("Tables created successfully")
	return nil
}
