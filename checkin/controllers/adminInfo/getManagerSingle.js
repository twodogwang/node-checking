const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");

const token = require("../../module/token.js").token;

router.get("/user/getManagerSingle",(req,res)=>{
    console.log("getManagerSingle")
    /* let sql = `SELECT 
    u_username,
    tel,
    email,
    u_bz FROM user WHERE u_id = ${req.query.u_id} ` */
    let sql = `SELECT
    u.u_id,
    u.u_username,
    u.tel,
    u.email,
    u.u_bz,
    r.role_name,
    u.superior,
    ur.role_id
    FROM
    user AS u
    LEFT JOIN user_role AS ur ON u.u_id = ur.u_id
    LEFT JOIN role AS r ON ur.role_id = r.role_id
    WHERE u.u_id = ${req.query.u_id}`
    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) console.error(err)
        res.send({'code':20000,formdata:results[0]});
    })
})


module.exports = router;