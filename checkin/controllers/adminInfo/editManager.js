const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;


router.post("/user/editManager",(req,res)=>{
    console.log("editManager")
    let u_username = req.body.u_username
    let u_password = secret(req.body.u_password)
    let tel = req.body.tel
    let email = req.body.email
    let u_bz = req.body.u_bz
    let superior = req.body.superior
    let editManager = new Promise((reslove,reject)=>{
        let sql = `UPDATE user SET u_username = "${u_username}",u_password="${u_password}",tel = "${tel}",email="${email}",u_bz="${u_bz}",superior = ${superior}
        WHERE u_id = ${req.body.u_id}`
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
    editManager.then(result=>{
        if(result == 1){
            let sql2 = `UPDATE user_role SET role_id = ${req.body.role_id} WHERE u_id = ${req.body.u_id}`
            console.log(sql2)
            query(sql2,(err,results,fields)=>{
                if(err) console.error(err)
                res.send({'code':20000,'msg':"修改成功"});
            })
            
        }else{
            res.send({'code':10000,'msg':"修改失败"});
        }
    })
})


module.exports = router;