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
            const id = 3; // test
    
            const newsContent = await db.getNewsPageContent(id); 
            const mainImage = await db.getImageById(newsContent.main_image);
            const newsTags = await db.getNewsTags(id); 
            const author = await db.getUserById(newsContent.author);
            const comments = await db.pullCommentsByNewsId(id);
    
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
    
            res.json({ success: true, responseContent });
        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }
    }

    async getResponsesByCommentId(req, res) {
        const { commentId } = req.body;
    
        try {
            const responses = await db.pullResponses(commentId);
            const responseValues = responses.map(response => Object.values(response)).flat();
            
            let allComments = [];
    
            for (const value of responseValues) {
                try {
                    const comments = await db.pullCommentsById(value);
                    
                    for (const comment of comments) {

                        const author = await db.getUserById(comment.author);

                        allComments.push({ comment: comment.comment_content, author });
                    }
    
                } catch (error) {
                    console.error('Ошибка при получении комментариев:', error);
                }
            }

            res.json({ success: true, comments: allComments });
    
        } catch (error) {
            console.error('Ошибка при получении ответов:', error);
            res.status(500).json({ success: false, message: 'О-па' });
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

    async addReply(req, res){
        try{

            const { userId, reply_content, comment_id} = req.body;


            console.log("reply_content")
            console.log(userId)
            console.log(reply_content)
            console.log(comment_id)

            const author = userId;
            
            await db.createReply({ author, reply_content, comment_id });
            res.status(200).json({ success: true, message: 'Comment added successfully' });
            

        } catch (error) {
            console.error('Помилка:', error);
            res.status(500).json({ success: false, message: 'О-па' });
        }

    }
    
}
module.exports = new NewsController();
