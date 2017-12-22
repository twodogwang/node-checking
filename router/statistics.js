const express = require("express")
const router = express.Router()
const statistics = require('../controllers/statistics')

router.get("/statistics/statisticsCustomer",statistics.statisticsCustomer)//获取统计客户信息
router.get("/statistics/statisticsOrder",statistics.statisticsOrder)//获取统计订单信息
router.post("/statistics/statisticsSingle",statistics.statisticsSingle)//


module.exports = router


