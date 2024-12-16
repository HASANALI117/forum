package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var DataBase *sql.DB

// We will store db globally in this example for simplicity
var DBHandler *DBWrapper

type DBWrapper struct {
	DB *DBResource
}

type DBResource struct {
	DBConn *sql.DB
}

func InitDB() (*sql.DB, error) {
	var err error
	DataBase, err = sql.Open("sqlite3", "pkg/db/forum.db")
	if err != nil {
		return nil, err
	}
	err = createTables(DataBase)
	if err != nil {
		return nil, err
	}

	if err = DataBase.Ping(); err != nil {
		return nil, err
	}

	log.Println("Database initialized successfully")
	return DataBase, nil
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
