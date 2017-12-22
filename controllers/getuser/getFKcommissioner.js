const query = require("../../module/sqlpool.js");
const GetUserInfo = require("../../module/getUserInfo.js").userInfo
exports.getFKcommissioner = function (req,res){
    const userInfo = GetUserInfo(req)
    const userId = userInfo.u_id
    const Level = userInfo.permissionLevel
    /* 
        获取风控专员列表，这个在设计的时候没有permissionLevel这个字段，后来加上了也懒得改了
        因为管理员也应该可以获取=。==
    */
    if(Level === 6){
        const sql = `SELECT
            u_username,
            u_id
            FROM
            user
            WHERE
            superior = ${userId}`
        console.log(sql)
        query(sql,(err,results,fields)=>{
            if(err) return console.error(err)
            if(results.length ===0){
                res.send({code:10000,msg:"用户列表为空"})
            }else{
                res.send({code:20000,msg:"获取风控专员成功",data:results})
            }
        })
    }
}
