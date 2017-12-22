

const query = require("../../module/sqlpool.js");

exports.getManagerSingle = function(req,res){
    console.log("getManagerSingle")
    /* let sql = `SELECT 
    u_username,
    tel,
    email,
    u_bz FROM user WHERE u_id = ${req.query.u_id} ` */
    /* 
        获取单个用户信息(包括自己)
    */
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
        res.send({'code':20000,'msg':"获取成功",formdata:results[0]});
    })
}
// router.get("/user/getManagerSingle",(req,res)=>{})
