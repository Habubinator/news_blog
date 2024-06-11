const db = require("./dbPool");

class DBController {
    // Create a new user
    async createUser({
        email,
        username,
        password,
        rating = 0,
        isBanned = false,
        isAdmin = false,
    }) {
        const query = `
        INSERT INTO users (email, username, password, rating, isBanned, isAdmin)
        VALUES ($1, $2, $3, $4, $5, $6)`;
        try {
            const result = await db.query(query, [
                email,
                username,
                password,
                rating,
                isBanned,
                isAdmin,
            ]);
            return result.rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // check if user with email exists in DB
    async findUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        try {
            const result = await db.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error(error, query);
            throw error;
        }
    }

    // Get a user by username
    async getUserByUsername(username) {
        const query = `SELECT * FROM users WHERE username = $1`;
        try {
            const result = await db.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a user by email
    async getUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        try {
            const result = await db.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a user by id
    async getUserById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Ban a user
    async banUser(id) {
        const query = `UPDATE users SET isBanned = TRUE WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Unban a user
    async unbanUser(id) {
        const query = `UPDATE users SET isBanned = FALSE WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Promote a user to admin
    async promoteUser(id) {
        const query = `UPDATE users SET isAdmin = TRUE WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Demote a user from admin
    async demoteUser(id) {
        const query = `UPDATE users SET isAdmin = FALSE WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Change user rating
    async changeUserRating({ id, increment }) {
        const query = `UPDATE users SET rating = rating + $1 WHERE id = $2`;
        try {
            const result = await db.query(query, [increment, id]);
            return result.rowCount;
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
        VALUES ($1, $2, $3, $4, $5)`;
        try {
            const result = await db.query(query, [
                id,
                author,
                comment_content,
                reply_to_comment,
                news_id,
            ]);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    async createCommentByUser({ author, comment_content, news_id }) {
        const query = `
        INSERT INTO comments (author, comment_content, reply_to_comment, news_id)
        VALUES ($1, $2, $3, $4)`;
        try {
            const result = await db.query(query, [
                author,
                comment_content,
                null,
                news_id,
            ]);
            console.log(author);
            console.log(result);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    async createReply({ author, reply_content, comment_id }) {
        const query = `
        INSERT INTO comments (author, comment_content, reply_to_comment, news_id)
        VALUES ($1, $2, $3, $4)`;
        try {
            const result = await db.query(query, [
                author,
                reply_content,
                comment_id,
                null,
            ]);
            console.log(author);
            console.log(result);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    async commentDublicator(author_id, news_id) {
        const query = `SELECT * FROM comments WHERE author = $1 AND news_id = $2;`;
        try {
            const result = await db.query(query, [author_id, news_id]);
            if (result.rows.length > 0) {
                // Если есть совпадения, возвращаем позитивный результат
                return { duplicate: true, message: "Duplicate comment found" };
            } else {
                // Если нет совпадений, возвращаем негативный результат
                return {
                    duplicate: false,
                    message: "No duplicate comments found",
                };
            }
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    //pulling comments
    async pullCommentsById(id) {
        const query = `SELECT * FROM comments WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);

            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    //pulling comments
    async pullCommentsByNewsId(id) {
        const query = `SELECT * FROM comments WHERE news_id = $1`;
        try {
            const result = await db.query(query, [id]);

            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    //pulling comments
    async pullResponses(id) {
        const query = `SELECT * FROM comments WHERE reply_to_comment = $1;`;
        try {
            const result = await db.query(query, [id]);

            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete a comment
    async deleteComment(id) {
        const query = `DELETE FROM comments WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a new image
    async createImage({ id, image_href }) {
        const query = `INSERT INTO images (id, image_href) VALUES ($1, $2)`;
        try {
            const result = await db.query(query, [id, image_href]);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get an image by id
    async getImageById(id) {
        const query = `SELECT * FROM images WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete an image
    async deleteImage(id) {
        const query = `DELETE FROM images WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a new tag
    async createTag({ id, tag_name }) {
        const query = `INSERT INTO tags (id, tag_name) VALUES ($1, $2)`;
        try {
            const result = await db.query(query, [id, tag_name]);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Get a tag by tag name
    async getTag(tag_name) {
        const query = `SELECT * FROM tags WHERE tag_name = $1`;
        try {
            const result = await db.query(query, [tag_name]);
            return result.rows[0];
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Delete a tag
    async deleteTag(id) {
        const query = `DELETE FROM tags WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
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
        INSERT INTO news (title, small_desc, main_image, author, news_content)
        VALUES ($1, $2, $3, $4, $5)`;
        try {
            const result = await db.query(query, [
                title,
                small_desc,
                main_image,
                author,
                news_content,
            ]);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    async getNews() {
        const query = "SELECT * FROM news";
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error("Ошибка:", error);
            throw error;
        }
    }

    async getNewsWithImages() {
        const query = `
        SELECT 
            news.id,
            news.title,
            news.small_desc,
            images.image_href AS main_image_href,
            news.author,
            news.news_content
        FROM 
            news
        JOIN 
            images ON news.main_image = images.id
    `;
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error("Ошибка:", error);
            throw error;
        }
    }

    async getNewsPageContent(id) {
        const query = "SELECT * FROM news WHERE id = $1;";
        try {
            const result = await db.query(query, [id]);

            return result.rows[0];
        } catch (error) {
            console.error("Ошибка:", error);
            throw error;
        }
    }

    // Delete a news article
    async deleteNews(id) {
        const query = `DELETE FROM news WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }

    // Create a news-tag association
    async createNewsTag({ id, tag_id, news_id }) {
        const query = `INSERT INTO news_tags (id, tag_id, news_id) VALUES ($1, $2, $3)`;
        try {
            const result = await db.query(query, [id, tag_id, news_id]);
            return result.rows;
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
        WHERE news_tags.news_id = $1`;
        try {
            const result = await db.query(query, [news_id]);
            return result.rows;
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
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.log(error, query);
            throw error;
        }
    }
}

module.exports = new DBController();
