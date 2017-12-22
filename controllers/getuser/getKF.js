const query = require("../../module/sqlpool.js");
/* const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel; */
const GetRoleId = require("../../module/getUserInfo.js").role_id;
exports.getFK = function (req,res){
    /* 
        获取 permissionLevel = 6  的用户，就是获取风控主管
    */
    const sql = `SELECT
    user.u_username,
    user.u_id
    FROM
    user
    INNER JOIN user_role AS ur ON user.u_id = ur.u_id
    INNER JOIN role AS r ON ur.role_id = r.role_id
    WHERE
    user.permissionLevel = 6 `

    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        if(results.length ===0){
            res.send({code:10000,msg:"用户列表为空"})
        }else{
            res.send({code:20000,msg:"获取列表成功",data:results})
        }
    })
}
