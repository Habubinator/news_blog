const db = require("../database/dbСontroller");
const path = require("path");

class AuthController {
    async getContent(req, res) {
        try {
            return res.json({
                success: true,
                data: await db.getNewsWithImages(),
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: `${error}` });
        }
    }

    async getMostPopularTags(req, res) {
        try {
            return res.json({
                success: true,
                data: await db.countTagsOfNews(),
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: `${error}` });
        }
    }
}

module.exports = new AuthController();
