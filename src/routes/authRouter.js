const Router = require("express");
const controller = require("../controllers/authController");
const router = new Router();

router.get("/login", controller.getLoginPage);
router.get("/register", controller.getRegisterPage);
router.post("/login", controller.login);
router.post("/register", controller.register);

module.exports = router;
