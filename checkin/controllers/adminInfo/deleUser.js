const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;


router.post("/user/deleUser",(req,res)=>{
    console.log("deleUser")
    let u_id = req.body.u_id
    let deleteUser = new Promise((resolve,reject)=>{
        let sql = `DELETE FROM user WHERE u_id = ${u_id}`
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            resolve(results.affectedRows)
        })
    })
    let deleteRole = new Promise((resolve,reject)=>{
        let sql = `DELETE FROM user_role WHERE u_id = ${u_id}`
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            resolve(results.affectedRows)
        })
    })
    Promise.all([deleteUser,deleteRole]).then((result)=>{
        if(result[0]==1&&result[1]==1){
            res.send({'code':20000,'msg':"删除成功"})
        }else{
            res.send({'code':10000,'msg':"删除失败请联系管理员"})
        }
    })
    
})


module.exports = router;