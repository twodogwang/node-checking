const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;


router.post("/user/register",(req,res)=>{
    console.log("register")
    let u_username = req.body.u_username
    let beforregister = new Promise((reslove,reject)=>{
        let sql = `SELECT u_username FROM user WHERE u_username = "${u_username}"`
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            if(results.length>0){
                reslove(2)
            }else{
                reslove(1)
            }
        })
    })
    beforregister.then(result=>{
        if(result == 1){
            let u_password = secret(req.body.u_password)
            let tel = req.body.tel
            let email = req.body.email
            let u_bz = req.body.u_bz
            let superior = req.body.superior
            let sql = `INSERT INTO user (u_username,u_password,tel,email,u_bz,superior) VALUES ("${u_username}","${u_password}","${tel}","${email}","${u_bz}",${superior})`
            query(sql,(err,results,fields)=>{
                if(err) console.error(err)
                let role_id = req.body.role_id
                let sql = `INSERT INTO user_role (u_id,role_id) VALUES (${results.insertId},${role_id})`
                query(sql,(err,results,fields)=>{
                    if(err) console.error(err)
                    res.send({'code':20000,'msg':"添加成功"});
                })
                
            })
        }else{
            res.send({'code':10000,'msg':"该用户已存在"});
        }
    })
})


module.exports = router;