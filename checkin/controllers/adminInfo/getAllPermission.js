

const query = require("../../module/sqlpool.js");
exports.AllPermission = function(req,res){
    console.log("AllPermission")
    let sql = `SELECT
    permission2.id,
    permission2.url,
    permission2.Pdesc,
    permission2.permissionBigType,
    permission2.permissionSmallType
    FROM
    permission2
    ORDER BY permissionSmallType`;
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({
            code:20000,
            msg:'获取成功',
            data:results
        })
    })
}
// router.get("/get/AllPermission",(req,res)=>{})
