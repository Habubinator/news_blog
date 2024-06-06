const Router = require("express");
const controller = require("../controllers/newsController");
const router = new Router();

router.get("/blog_page", controller.getNewsPage);
router.get("/blog_page/news_content", controller.getNewsPageContent);
router.post("/blog_page/submit_comment", controller.addComment)
router.post("/blog_page/responses/:commentId", controller.getResponsesByCommentId);

module.exports = router;
