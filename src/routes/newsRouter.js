const Router = require("express");
const controller = require("../controllers/newsController");
const router = new Router();

router.get("/:newsId", controller.getNewsPage);
router.get("/:newsId/news_content", controller.getNewsPageContent);
router.post("/:newsId/submit_comment", controller.addComment);
router.post(
    "/:newsId/responses/:commentId",
    controller.getResponsesByCommentId
);
router.post("/:newsId/submit_reply", controller.addReply);

module.exports = router;
