const db = require("./dbPool");

class DBController {
    // Create a new user
    async createUser({
        id,
        email,
        username,
        password,
        rating = 0,
        isBanned = false,
        isAdmin = false,
    }) {
        const query = `
        INSERT INTO users (id, email, username, password, rating, isBanned, isAdmin)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        try {
            const [rows] = await db.query(query, [
                id,
                email,
                username,
                password,
                rating,
                isBanned,
                isAdmin,
            ]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a user by username
    async getUserByUsername(username) {
        const query = `SELECT * FROM users WHERE username = $1`;
        try {
            const [rows] = await db.query(query, [username]);
            return rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a user by email
    async getUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = ?`;
        try {
            const [rows] = await db.query(query, [email]);
            return rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a user by id
    async getUserById(id) {
        const query = `SELECT * FROM users WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Ban a user
    async banUser(id) {
        const query = `UPDATE users SET isBanned = TRUE WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Unban a user
    async unbanUser(id) {
        const query = `UPDATE users SET isBanned = FALSE WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Promote a user to admin
    async promoteUser(id) {
        const query = `UPDATE users SET isAdmin = TRUE WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Demote a user from admin
    async demoteUser(id) {
        const query = `UPDATE users SET isAdmin = FALSE WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Change user rating
    async changeUserRating({ id, increment }) {
        const query = `UPDATE users SET rating = rating + ? WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [increment, id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a new comment
    async createComment({
        id,
        author,
        comment_content,
        reply_to_comment,
        news_id,
    }) {
        const query = `
        INSERT INTO comments (id, author, comment_content, reply_to_comment, news_id)
        VALUES (?, ?, ?, ?, ?)`;
        try {
            const [rows] = await db.query(query, [
                id,
                author,
                comment_content,
                reply_to_comment,
                news_id,
            ]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete a comment
    async deleteComment(id) {
        const query = `DELETE FROM comments WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a new image
    async createImage({ id, image_href }) {
        const query = `INSERT INTO images (id, image_href) VALUES (?, ?)`;
        try {
            const [rows] = await db.query(query, [id, image_href]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get an image by id
    async getImageById(id) {
        const query = `SELECT * FROM images WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete an image
    async deleteImage(id) {
        const query = `DELETE FROM images WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a new tag
    async createTag({ id, tag_name }) {
        const query = `INSERT INTO tags (id, tag_name) VALUES (?, ?)`;
        try {
            const [rows] = await db.query(query, [id, tag_name]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a tag by tag name
    async getTag(tag_name) {
        const query = `SELECT * FROM tags WHERE tag_name = ?`;
        try {
            const [rows] = await db.query(query, [tag_name]);
            return rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete a tag
    async deleteTag(id) {
        const query = `DELETE FROM tags WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a new news article
    async createNews({
        id,
        title,
        small_desc,
        main_image,
        author,
        news_content,
    }) {
        const query = `
        INSERT INTO news (id, title, small_desc, main_image, author, news_content)
        VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const [rows] = await db.query(query, [
                id,
                title,
                small_desc,
                main_image,
                author,
                news_content,
            ]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete a news article
    async deleteNews(id) {
        const query = `DELETE FROM news WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a news-tag association
    async createNewsTag({ id, tag_id, news_id }) {
        const query = `INSERT INTO news_tags (id, tag_id, news_id) VALUES (?, ?, ?)`;
        try {
            const [rows] = await db.query(query, [id, tag_id, news_id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get tags for a news article by news id
    async getNewsTags(news_id) {
        const query = `
        SELECT tags.tag_name
        FROM tags
        JOIN news_tags ON tags.id = news_tags.tag_id
        WHERE news_tags.news_id = ?`;
        try {
            const [rows] = await db.query(query, [news_id]);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Count the number of news articles for each tag
    async countTagsOfNews() {
        const query = `
        SELECT tags.tag_name, COUNT(news_tags.news_id) as news_count
        FROM tags
        JOIN news_tags ON tags.id = news_tags.tag_id
        GROUP BY tags.tag_name`;
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }
}

module.exports = new DBController();
