

const query = require("../../module/sqlpool.js");
exports.editPermission = function(req,res){
    console.log("editPermission")
    /* 
        编辑权限
        url:权限路径
        pDesc:权限描述
        permissionBigType:权限大类
        permissionSmallType:权限小类

    */
    let url = req.body.url
    let pDesc = req.body.pDesc
    let permissionBigType = req.body.type[0]
    let permissionSmallType = req.body.type[1]
    let id = req.body.id
    console.log(req.body)
    let sql = `UPDATE permission2 SET url = "${url}",pDesc = "${pDesc}",permissionBigType="${permissionBigType}", permissionSmallType="${permissionSmallType}" WHERE id = ${id}`
    console.log(sql)
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({'code':20000,'msg':"权限添加成功"})
    })
}
// router.post("/permission/editPermission",(req,res)=>{})

