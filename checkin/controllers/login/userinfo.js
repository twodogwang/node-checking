const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const token = require("../../module/token.js").token;

router.get("/user/info",(req,res)=>{
    let Xtoken = req.header("X-Token")
    let sql = `SELECT token FROM cookie_token WHERE token = "${Xtoken}"`
    let checkToken = new Promise((resolve,reject)=>{
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            if(results.length == 0){
                resolve({'code':50014})
            }else{
                let tokendata = token.decodeToken(results[0].token);
                let now = (new Date().getTime())/1000
                let tokenCreated = tokendata.payload.created
                let tokenExp = tokendata.payload.exp
                let newExp = now - tokenCreated
                if(newExp > tokenExp){
                    let sql2 = `DELETE FROM cookie_token WHERE token = "${results[0].token}"`
                    query(sql2,(err,results,fields)=>{
                        if(err) console.error(err)
                        resolve({'code':50014})
                    })
                }else{
                    resolve({
                        'code':20000,
                        'data':{
                            'role':[tokendata.payload.data.role_id],
                            'name':tokendata.payload.data.u_username
                        }
                    })
                }
            }
        })
    })
    checkToken.then((result)=>{
        res.send(result)
    })
})

module.exports = router;