const Router = require("express");
const controller = require("../controllers/newsController");
const router = new Router();

//TODO - убрать /blog_page
router.get("/:newsId", controller.getNewsPage);
router.get("/:newsId/news_content", controller.getNewsPageContent);
router.post("/blog_page/submit_comment", controller.addComment);
router.post(
    "/blog_page/responses/:commentId",
    controller.getResponsesByCommentId
);
router.post("/blog_page/submit_reply", controller.addReply);

module.exports = router;
