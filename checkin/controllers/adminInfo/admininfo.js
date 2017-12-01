const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const token = require("../../module/token.js").token;


router.get("/user/admininfo",(req,res)=>{
    console.log("admininfo")
    let sql = `SELECT
    u.u_id,
    u.u_username,
    u.tel,
    u.email,
    u.u_bz,
    r.role_name
    FROM
    user AS u
    INNER JOIN user_role AS ur ON u.u_id = ur.u_id
    INNER JOIN role AS r ON ur.role_id = r.role_id`
    query(sql,(err,results,fields)=>{
        if(err) console.error(err)
        res.send({'code':20000,'data':results});
    })
})


module.exports = router;