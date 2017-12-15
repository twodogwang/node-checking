

const query = require("../../module/sqlpool.js");
const token = require("../../module/token.js").token;

exports.logout = function(req,res){
    let Xtoken = req.header("X-Token")
    let sql = `DELETE FROM cookie_token WHERE token = "${Xtoken}"`
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({code:20000,msg:"登出成功"})
    })
}
// router.post("/user/logout",(req,res)=>{})
