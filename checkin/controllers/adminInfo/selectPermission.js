const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");

router.get("/permission/selectPermission",(req,res)=>{
    console.log("selectPermission")
    let sql = `SELECT id,url,pDesc,permissionBigType,permissionSmallType FROM permission2 WHERE id = ${req.query.id}`
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({'code':20000,'data':results[0]});
    })
})


module.exports = router;