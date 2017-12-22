const express = require("express")
const router = express.Router()
const follow = require('../controllers/follow')

router.post("/follow/addFollow", follow.addFollow)//新增跟进
router.get("/follow/getTodayTodoFollow", follow.getTodayTodoFollow)//获取今日待跟进
router.get("/follow/getTodoFollow", follow.getTodoFollow)//获取所有带跟进
router.get("/follow/completeFollow", follow.completeFollow)//完成跟进
module.exports = router
