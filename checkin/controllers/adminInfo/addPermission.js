

const query = require("../../module/sqlpool.js");

exports.addPermission = function(req,res){
    console.log("addPermission")
    let url = req.body.url
    let pDesc = req.body.pDesc
    let permissionBigType = req.body.type[0]
    let permissionSmallType = req.body.type[1]
    console.log(req.body)
    let sql = `INSERT INTO permission2 (url,pDesc,permissionBigType,permissionSmallType) VALUES ("${url}","${pDesc}",${permissionBigType},${permissionSmallType})`
    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({'code':20000,'msg':"权限添加成功"})
    })
}
// router.post("/permission/addPermission",(req,res)=>{})
