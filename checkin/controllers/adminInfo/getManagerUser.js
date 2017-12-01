const express = require("express");
const router = express.Router();
const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;

router.get("/user/getManagerUser",(req,res)=>{
    console.log("getManagerUser")
    let role_id = req.query.role_id
    switch (Number(role_id)) {
        case 5:
            var sql2 = `WHERE ur.role_id = 4`
            break;
        case 6:
            var sql2 = `WHERE ur.role_id = 3`
            break;
        default:
            var sql2 = `WHERE ur.role_id = 1`
            break;
    }
    let sql = `SELECT
    u.u_username,
    u.u_id,
    ur.role_id
    FROM
    user u
    INNER JOIN user_role ur ON u.u_id = ur.u_id `
    sql += sql2;
    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) console.error(err)
        res.send({'code':20000,'data':results});
    })
})


module.exports = router;