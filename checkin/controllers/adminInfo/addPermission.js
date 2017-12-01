const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");

router.post("/permission/addPermission",(req,res)=>{
    console.log("addPermission")
    let url = req.body.url
    let pDesc = req.body.pDesc
    let permissionBigType = req.body.type[0]
    let permissionSmallType = req.body.type[1]
    console.log(req.body)
    let sql = `INSERT INTO permission2 (url,pDesc,permissionBigType,permissionSmallType) VALUES ("${url}","${pDesc}",${permissionBigType},${permissionSmallType})`
    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({'code':20000,'msg':"权限修改成功"})
    })
})


module.exports = router;