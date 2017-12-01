const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;

router.get("/user/getrolename",(req,res)=>{
    console.log("getrolename")
    let sql = `SELECT role_name, role_id FROM role `
    query(sql,(err,results,fields)=>{
        if(err) console.error(err)
        res.send({'code':20000,'data':results});
    })
})


module.exports = router;