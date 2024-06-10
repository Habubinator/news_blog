const db = require("../database/dbСontroller");
const path = require("path");

class AuthController {
    async getAdminPage(req, res) {
        try {
            return res.sendFile(
                path.join(process.cwd(), "public", "html", "admin_page.html")
            );
        } catch (error) {
            return res.status(500).json({ success: false, error: `${error}` });
        }
    }

    async getAdminPageContent(req, res) {
        try {
            if (res.locals.isExpired) {
                return res.status(300).redirect("../");
            }
            if (res.locals.decoded) {
                return res.json({
                    success: true,
                    data: await db.getNews(),
                });
            }
            return res
                .status(401)
                .json({ success: false, message: `Не авторизований` });
        } catch (error) {
            return res.status(500).json({ success: false, error: `${error}` });
        }
    }

    async deletePage(req, res) {
        try {
            if (res.locals.isExpired) {
                return res.status(300).redirect("../");
            }
            if (res.locals.decoded) {
                const { newsId } = req.body;
                if (newsId) {
                    await db.deleteNews(newsId);
                    return res.json({
                        success: true,
                    });
                }
                return res
                    .status(400)
                    .json({ success: false, message: `Не вказані параметри` });
            }
            return res
                .status(401)
                .json({ success: false, message: `Не авторизований` });
        } catch (error) {
            return res.status(500).json({ success: false, error: `${error}` });
        }
    }
}

module.exports = new AuthController();
