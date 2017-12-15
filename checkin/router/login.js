const express = require("express");
const router = express.Router();
const login = require('../controllers/login')

router.post("/user/login", login.login)
router.post("/user/logout",login.logout)
router.get("/user/info",login.userinfo)

module.exports = router