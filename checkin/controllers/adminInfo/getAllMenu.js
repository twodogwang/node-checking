

const query = require("../../module/sqlpool.js");
exports.getAllMenu = function(req,res){
    console.log("getAllMenu")
    let sql = `SELECT
    id,
    menu,
    Mdesc
    FROM
    menu1
    ORDER BY id`;
    query(sql,(err,results,fields)=>{
        if(err) return console.error(err)
        res.send({
            code:20000,
            msg:'获取成功',
            data:{
              list:results
            }
        })
    })
}
// router.get("/get/AllPermission",(req,res)=>{})
