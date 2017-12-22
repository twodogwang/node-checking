const query = require("../../module/sqlpool.js");

exports.deleMenu = function (req, res) {
  console.log("deleMenu")
  let menuId = req.body.id
  /* 
    deleteMenu:删除路由
    selectANDdeleRoleMenu:删除role_menu中的数据
  */
  let deleteMenu = new Promise((resolve, reject) => {
    let sql = `DELETE FROM menu1 WHERE id = ${menuId}`
    query(sql, (err, results, fields) => {
      if (err) console.error(err)
      resolve(results.affectedRows)
    })
  })

  let selectANDdeleRoleMenu = new Promise((resolve, reject) => {
    let sql = `DELETE FROM role_menu WHERE menuId = ${menuId}`
    query(sql,(err,results,fields)=>{
      if(err) return console.error(err)
      resolve(results.affectedRows)
    })
  })


  Promise.all([deleteMenu,selectANDdeleRoleMenu]).then((result) => {
    if (result[0] > 0 && result[1] >= 0 ) {
      res.send({ 'code': 20000, 'msg': "删除成功" })
    } else {
      res.send({ 'code': 10000, 'msg': "删除失败请联系管理员" })
    }
  })
}
