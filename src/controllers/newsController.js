const db = require("../database/dbСontroller");
const path = require("path");
const jwt = require("jsonwebtoken");
const pool = require("./dbPool");

class NewsController
{
    async getNewsPage(req, res) {
        try {
            return res.sendFile(
                path.join(process.cwd(), "public", "html", "blog_page.html")
            );
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: `${error}` });
        }
    }

    
}
module.exports = new NewsController();
