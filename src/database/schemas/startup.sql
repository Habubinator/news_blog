CREATE TABLE
    users (
        id INT PRIMARY KEY,
        email VARCHAR(32),
        username VARCHAR(16),
        password VARCHAR(16),
        rating INT,
        isBanned BOOL,
        isAdmin BOOL
    );

CREATE TABLE
    comments (
        id INT PRIMARY KEY,
        author INT,
        comment_content VARCHAR(512),
        reply_to_comment INT,
        FOREIGN KEY (author) REFERENCES users (id),
        FOREIGN KEY (reply_to_comment) REFERENCES comments (id)
    );

ALTER TABLE comments ADD news_id INT;

ALTER TABLE comments ADD FOREIGN KEY (news_id) REFERENCES news (id);

CREATE TABLE
    images (id INT PRIMARY KEY, image_href VARCHAR(256));

CREATE TABLE
    tags (id INT PRIMARY KEY, tag_name VARCHAR(32));

CREATE TABLE
    news (
        id INT PRIMARY KEY,
        title VARCHAR(32),
        small_desc VARCHAR(256),
        main_image INT,
        author INT,
        news_content VARCHAR(16300),
        FOREIGN KEY (main_image) REFERENCES images (id),
        FOREIGN KEY (author) REFERENCES users (id)
    );

CREATE TABLE
    news_tags (
        id INT PRIMARY KEY,
        tag_id INT,
        news_id INT,
        FOREIGN KEY (tag_id) REFERENCES tags (id),
        FOREIGN KEY (news_id) REFERENCES news (id)
    );

    