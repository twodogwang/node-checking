const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");

router.post("/permission/delePermission",(req,res)=>{
    console.log("addPermission")
    let id = req.body.id
    console.log(req.body)
    let sql = `DELETE FROM permission2 WHERE id = ${id}`
    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({'code':20000,'msg':"权限删除成功"})
    })
})


module.exports = router;