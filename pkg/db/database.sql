CREATE TABLE
    IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        age INTEGER,
        gender TEXT,
        first_name TEXT,
        last_name TEXT,
        image TEXT
    );

-- DROP TABLE users;
CREATE TABLE
    IF NOT EXISTS sessions (
        session_token TEXT PRIMARY KEY,
        user_id TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

-- DROP TABLE sessions;
CREATE TABLE
    IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        category TEXT,
        title TEXT,
        content TEXT,
        created_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

-- DROP TABLE posts;
CREATE TABLE
    IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        post_id TEXT,
        user_id TEXT,
        content TEXT,
        created_at DATETIME,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

-- DROP TABLE comments;
CREATE TABLE
    IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sender_id TEXT,
        receiver_id TEXT,
        content TEXT,
        created_at DATETIME,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
    );

-- DROP TABLE messages;