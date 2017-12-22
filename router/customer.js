const express = require("express")
const router = express.Router()
const customer = require('../controllers/customer')

router.post("/customer/addcustomer", customer.addCustomer)//新增客户
router.get("/customer/alreadyTransform",customer.alreadyTransform)//获取已转移客户
router.post("/customer/changeAssetInfo", customer.changeAssetInfo)//修改资产信息
router.post("/customer/changeFarenInfo", customer.changeFarenInfo)//修改法人信息
router.post("/customer/changeInfo", customer.changeInfo)//修改个人信息
router.post("/customer/changeWorkinfo", customer.changeWorkInfo)//修改工作信息
router.get("/customer/intentionCustomer",customer.intentionCustomer)//获取意向客户
router.get("/customer/serch",customer.serchCustomer)//按电话搜索客户
router.get("/customer/checkLog",customer.checkLog)//查客户信息
router.get("/customer/waitForTransform",customer.waitForTransform)//获取待转移客户
router.get("/customer/getOrder",customer.getOrder)//获取客户订单信息(营销)
router.post("/customer/addOrder",customer.addOrder)//新增订单
router.post("/customer/searchCustomerList",customer.searchCustomerList)//搜索客户
router.post("/customer/sendCustomer",customer.sendCustomer)//客户派单
router.post("/customer/customerOut",customer.customerOut)//移入公海
router.post("/customer/transformCustomer",customer.transformCustomer)//转移客户
router.get("/customer/searchCustomerById",customer.searchCustomerById)//根据ID搜索客户
router.get("/customer/highseasCustomer",customer.highseasCustomer)//获取公海客户

module.exports = router
