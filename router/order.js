const express = require("express")
const router = express.Router()
const order = require('../controllers/order')

router.get("/order/getAllOrder", order.getAllorder)//获取所有订单
router.get("/order/waitForAccept", order.waitForAccept)//获取待接收订单
router.get("/order/checkin", order.checkin)//获取跟进中订单
router.get("/order/checkBz", order.checkBz)//查看备注
router.get("/order/checkLog", order.checkLog)//查看订单日志
router.get("/order/getPayforOrder", order.getPayforOrder)//获取已放款订单
router.get("/order/getDeferOrder", order.getDeferOrder)//获取暂缓订单
router.get("/order/getChargebackOrder", order.getChargebackOrder)//获取退单订单
router.post("/order/transformOrder", order.transformOrder)//转移订单
router.post("/order/changeProType", order.changeProType)//修改生产状态
router.post("/order/changeChannel", order.changeChannel)//修改渠道
router.post("/order/writeLog", order.writeLog)//填写订单日志
router.post("/order/affirmOrder", order.affirmOrder)//确认订单
router.post("/order/searchOrderList", order.searchOrderList)//一般搜索订单
router.post("/order/searchPayforOrderList", order.searchPayforOrderList)//搜索已放款订单
router.get("/order/getApprovalOrder",order.getApprovalOrder)//获取审批中订单
router.get("/order/getCustomerTel",order.getCustomerTel)//获取客户电话
router.get("/order/getCompleteOrder",order.getCompleteOrder)//获取已完成订单
module.exports = router
