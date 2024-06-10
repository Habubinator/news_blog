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

            const {newsId} = req.params
        
            const newsContent = await db.getNewsPageContent(newsId); 
            const mainImage = await db.getImageById(newsContent.main_image);
            const newsTags = await db.getNewsTags(newsId); 
            const author = await db.getUserById(newsContent.author);
            const comments = await db.pullCommentsByNewsId(newsId);
    
            const commentsWithAuthors = await Promise.all(comments.map(async (comment) => {
                const commentAuthor = await db.getUserById(comment.author);
                return {
                    ...comment,
                    author: commentAuthor
                };
            }));
    
            const responseContent = {
                ...newsContent,
                mainImage: mainImage,
                tags: newsTags,
                author: author,
                comments: commentsWithAuthors
            };

            console.log("newsContent.news_content")
            console.log(newsContent.news_content)

    
            res.json({ success: true, responseContent });
        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }
    }

    async getResponsesByCommentId(req, res) {
        const { commentId } = req.body;
    
        try {
            
            const response = await db.pullResponses(commentId)

            const responsesWithAuthors = await Promise.all(response.map(async (response) => {
                const responseAuthor = await db.getUserById(response.author);
                return {
                    ...response,
                    author: responseAuthor
                };
            }));

            res.json({ success: true, responsesWithAuthors });
    
        } catch (error) {
            console.error('Помилка при отриманні відповіді:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }
    }
    

    async addComment(req, res){
        try{

            const { comment_content } = req.body;

            const {newsId} = req.params

            if (res.locals.isExpired) {
                return res.status(300).redirect("../");
            }
            if (res.locals.decoded) {
                const userId = res.locals.decoded.user.id;
                console.log(user);

                if (!comment_content.trim()) {
                    return res.status(401).json({ success: false, message: 'Comment content is empty' });
                }
    
                const author = userId;
    
                const duplicateCheck = await db.commentDublicator(author, newsId);
    
                if (duplicateCheck.duplicate) {
                    res.status(201).json({ success: false, message: 'Duplicate comment found' });
                } else {
                    await db.createCommentByUser({ author, comment_content, news_id });
                    res.status(200).json({ success: true, message: 'Comment added successfully' });
                }
            }
        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }

    }

    async addReply(req, res){
        try{

            const { reply_content, comment_id} = req.body;

            if (res.locals.isExpired) {
                return res.status(300).redirect("../");
            }
            if (res.locals.decoded) {
                const userId = res.locals.decoded.user.id;
                console.log(user);

                const author = userId;
            
                await db.createReply({ author, reply_content, comment_id });
                res.status(200).json({ success: true, message: 'Comment added successfully' });
            
            }
            

        } catch (error) {
            console.error('Помилка: ', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }

    }
    
}
module.exports = new NewsController();
