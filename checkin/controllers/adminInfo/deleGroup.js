const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;


router.post("/group/deleGroup",(req,res)=>{
    console.log("deleGroup")
    let role_id = req.body.role_id
    let deleteRole = new Promise((resolve,reject)=>{
        let sql = `DELETE FROM role WHERE role_id = ${role_id}`
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            resolve(results.affectedRows)
        })
    })

    let selectANDdeleU_id = new Promise((resolve,reject)=>{
        let sql = `SELECT u_id FROM user_role WHERE role_id = ${role_id}`
        console.log(sql)
        query(sql,(err,results,fields)=>{
            if(err) return console.error(err)
            if(results.length == 0 ){
                resolve(1)
            }else{
                let sqlconcat = "("
                for(let i = 0; i < results.length;i++){
                    if(i == results.length-1){
                        sqlconcat += results[i].u_id + ")"
                        continue
                    }
                    sqlconcat += results[i].u_id + ","
                }
                let sql2 = `DELETE FROM user WHERE u_id in ${sqlconcat}`
                console.log(sql2)
                query(sql2,(err,results,fields)=>{
                    if(err) console.error(err)
                    if(results.affectedRows>0){
                        let sql = `DELETE FROM user_role WHERE role_id = ${role_id}`
                        console.log(sql)
                        query(sql,(err,results,fields)=>{
                            if(err) console.error(err)
                            resolve(results.affectedRows)
                        })
                    }else{
                        resolve(1)
                    }
                })
            }
        })
    })
    selectANDdeleU_id.then(result=>{
        if(result>0){
            
        }else{
            return 1
        }
    })
    let deleteUser = new Promise((resolve,reject)=>{
        let sql = `DELETE FROM user_role WHERE role_id = ${role_id}`
        console.log(sql)
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            resolve(1)
        })
    })
    Promise.all([selectANDdeleU_id,deleteUser,deleteRole]).then((result)=>{
        console.log("result0",result[0])
        console.log("result1",result[1])
        console.log("result2",result[2])
        if(result[0] > 0 && result[1] > 0&& result[2] > 0){
            res.send({'code':20000,'msg':"删除成功"})
        }else{
            res.send({'code':10000,'msg':"删除失败请联系管理员"})
        }
    })
    
})

module.exports = router;