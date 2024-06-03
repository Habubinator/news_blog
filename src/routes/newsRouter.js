const Router = require("express");
const controller = require("../controllers/newsController");
const router = new Router();

router.get("/blog_page", controller.getNewsPage);

module.exports = router;
