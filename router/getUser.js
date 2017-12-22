const express = require("express")
const router = express.Router()
const getUser = require('../controllers/getUser')

router.get("/getUser/getSeller", getUser.getSeller)//获取营销主管
router.get("/getUser/getFK", getUser.getFK)//获取风控主管
router.get("/getUser/getFKcommissioner", getUser.getFKcommissioner)//获取风控专员

module.exports = router
