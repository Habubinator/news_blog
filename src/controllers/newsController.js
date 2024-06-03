const db = require("../database/dbСontroller");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require('fs').promises;


class NewsController
{
    async getNewsPage(req, res) {
        try {
            const templatePath = path.join(process.cwd(), "public", "html", "blog_page.html");
            let template = await fs.readFile(templatePath, 'utf-8');

            const id = 3; // test
            const newsContent = await db.getNewsPageContent(id);

            template = template.replace('<!-- news_content -->', newsContent);

            res.send(template);
        } catch (error) {
            console.error('Ошибка:', error);
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    
}
module.exports = new NewsController();
