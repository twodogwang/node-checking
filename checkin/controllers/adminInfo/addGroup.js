const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;


router.post("/group/addGroup",(req,res)=>{
    console.log("addGroup")
    let gropuname = req.body.role_name
    let beforAdd = new Promise((reslove,reject)=>{
        let sql = `SELECT role_name FROM role WHERE role_name = "${gropuname}"`
        console.log(sql)
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            if(results.length>0){
                reslove(2)
            }else{
                reslove(1)
            }
        })
    })
    beforAdd.then(result=>{
        if(result == 1){
            let desc = req.body.role_desc
            let sql2 = `INSERT INTO role (role_name,role_desc) VALUES ("${gropuname}","${desc}")`
            console.log(sql2)
            query(sql2,(err,results,fields)=>{
                if(err) console.error(err)
                res.send({'code':20000,'msg':"添加成功"});
            })
            
        }else{
            res.send({'code':10000,'msg':"该分组已存在"});
        }
    })
})


module.exports = router;