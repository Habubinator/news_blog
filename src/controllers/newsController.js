const db = require("../database/dbСontroller");
const path = require("path");
const jwt = require("jsonwebtoken");

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

    async getNewsPageContent(req, res) {
        try {
            const id = 3; //test

            const newsContent = await db.getNewsPageContent(id); 
            const newsTags = await db.getNewsTags(id); 
            const author = await db.getUserById(newsContent.author);

            console.log('Thats the way it is')
            console.log(author)

            const responseContent = {
                ...newsContent,
                tags: newsTags,
                author: author
            };
    
            res.json({ success: true, responseContent });
        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }
    }

    
}
module.exports = new NewsController();
