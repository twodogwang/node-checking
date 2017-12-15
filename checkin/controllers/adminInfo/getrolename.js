

const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;

exports.getrolename = function(req,res){
    console.log("getrolename")
    let sql = `SELECT role_name, role_id FROM role `
    query(sql,(err,results,fields)=>{
        if(err) console.error(err)
        res.send({'code':20000,'msg':"获取成功",'data':results});
    })
}
// router.get("/user/getrolename",(req,res)=>{})
