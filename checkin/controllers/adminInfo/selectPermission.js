

const query = require("../../module/sqlpool.js");
exports.selectPermission = function(req,res){
    console.log("selectPermission")
    let sql = `SELECT id,url,pDesc,permissionBigType,permissionSmallType FROM permission2 WHERE id = ${req.query.id}`
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({'code':20000,'msg':"设置成功",'data':results[0]});
    })
}
// router.get("/permission/selectPermission",(req,res)=>{})
