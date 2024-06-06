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
            const mainImage = await db.getImageById(newsContent.main_image)
            const newsTags = await db.getNewsTags(id); 
            const author = await db.getUserById(newsContent.author);
            const comments = await db.pullCommentsByNewsId(id);

            const responseContent = {
                ...newsContent,
                mainImage: mainImage,
                tags: newsTags,
                author: author,
                comments: comments
            };
    
            res.json({ success: true, responseContent });
        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }
    }

    async getResponsesByCommentId(req, res) {
        const { commentId } = req.body;

        const responses = await db.pullResponses(commentId);

        const responseValues = responses.map(response => Object.values(response)).flat();

        console.log(  responseValues  )

        for (const value of responseValues) {
            try {
                const comments = await db.pullCommentsById(value);
                console.log(comments); // Обработка полученных комментариев
            } catch (error) {
                console.error('Ошибка при получении комментариев:', error);
            }
        }

    }
    

    async addComment(req, res){
        try{

            const { userId, comment_content, news_id } = req.body;

            const author = userId;

            const duplicateCheck = await db.commentDublicator(author, news_id);

            if (duplicateCheck.duplicate) {
                res.status(400).json({ success: false, message: 'Duplicate comment found' });
            } else {
                await db.createCommentByUser({ author, comment_content, news_id });
                res.status(200).json({ success: true, message: 'Comment added successfully' });
            }

        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }

    }
    
}
module.exports = new NewsController();
