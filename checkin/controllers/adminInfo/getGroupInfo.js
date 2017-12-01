const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const token = require("../../module/token.js").token;

router.get("/group/getGroupInfo",(req,res)=>{
    console.log("getGroupInfo")
    const pageInfo = JSON.parse(req.query.pageInfo)
    let sellecttotal = new Promise((resolve,reject)=>{
        let total = `SELECT role_id FROM role`
        query(total,(err,results,fields)=>{
            if(err) return reject(err)
            resolve(results.length)
        })
    })

    sellecttotal.then((result)=>{
        let curPage = pageInfo.pageNum
        let pageSize = pageInfo.pageSize
        if( result < pageSize ){
            var sql2 = `SELECT role_name,role_id,role_desc FROM role LIMIT ${result*(curPage-1)},${result}`
        }else{
            var sql2 = `SELECT role_name,role_id,role_desc FROM role LIMIT ${pageSize*(curPage-1)},${pageSize}`
        }
        query(sql2,(err,results,fields)=>{
            if(err) return console.error(err)
            res.send({
                'code':20000,
                'data':{
                    list:results,
                    pageNum:Number(curPage),
                    pageSize:pageSize,
                    totalItems:result
                }
            });
        })
    })
})


module.exports = router;