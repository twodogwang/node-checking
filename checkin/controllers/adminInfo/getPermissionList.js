const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;

router.get("/permission/getPermissionList",(req,res)=>{
    console.log("getPermissionList")
    const pageInfo = JSON.parse(req.query.pageInfo)
    let permissionBigType = pageInfo.big
    let permissionSmallType = pageInfo.small
    let sellecttotal = new Promise((resolve,reject)=>{
        let total = `SELECT id FROM permission2 WHERE permissionSmallType = ${permissionSmallType} AND permissionBigType = ${permissionBigType}`
        query(total,(err,results,fields)=>{
            if(err) console.error(err)
            resolve(results.length)
        })
        
    })
    sellecttotal.then((result)=>{
        let curPage = pageInfo.pageNum
        let pageSize = pageInfo.pageSize
        if( result < pageSize ){
            var sql2 = `SELECT id,url,pDesc,permissionSmallType,permissionBigType FROM permission2 WHERE permissionSmallType = ${permissionSmallType} AND permissionBigType = ${permissionBigType} LIMIT ${result*(curPage-1)},${result}`
        }else{
            var sql2 = `SELECT id,url,pDesc,permissionSmallType,permissionBigType FROM permission2 WHERE permissionSmallType = ${permissionSmallType} AND permissionBigType = ${permissionBigType} LIMIT ${pageSize*(curPage-1)},${pageSize}`
        }
        console.log(sql2)
        query(sql2,(err,results,fields)=>{
            if(err) console.error(err)
            res.send({
                'code':20000,
                'data':{
                    list:results,
                    pageNum:Number(curPage),
                    pageSize:pageSize,
                    total:result
                }
            })
        })
    }).catch((err)=>{
        return console.log(err)
    })
})

module.exports = router;