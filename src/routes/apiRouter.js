const Router = require("express");
const controller = require("../controllers/apiController");
const router = new Router();

router.get("/content", controller.getContent);
router.post("/contentByTagId", controller.getContentByTag);
router.get("/tags", controller.getMostPopularTags);

module.exports = router;
