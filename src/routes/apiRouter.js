const Router = require("express");
const controller = require("../controllers/apiController");
const router = new Router();

router.get("/content", controller.getContent);
router.get("/tags", controller.getMostPopularTags);

module.exports = router;
