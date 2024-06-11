const Router = require("express");
const controller = require("../controllers/adminController");
const router = new Router();

router.get("/", controller.getAdminPage);
router.get("/content", controller.getAdminPageContent);
router.delete("/delete", controller.deletePage);
module.exports = router;
