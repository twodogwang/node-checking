const query = require("../../module/sqlpool.js");
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;

exports.getSeller = function (req,res){
    let userId = GetuserID(req)
    let Level = GetpermissionLevel(req)
    if( Level === 1 ){
        var sql = `SELECT u_id,u_username FROM user WHERE permissionLevel = 4`
    }else{
        var sql = `SELECT u_id,u_username FROM user WHERE permissionLevel = 4 AND superior = ${userId}`
    }
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