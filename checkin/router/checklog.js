const express = require("express")
const router = express.Router()
const checklog = require('../controllers/checklog')

router.post("/checklog/customerlog", checklog.checkCustomerLog)

module.exports = router