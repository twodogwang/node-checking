const query = require("../../module/sqlpool.js");

exports.setMenu = function (req, res) {
  console.log("setMenu!!!!setMenu")
  const menuId = req.body.menuId
  const role_id = req.body.role_id
  let values = "";
  if (menuId.length > 1) {
    for (let i = 0; i < menuId.length; i++) {
      if (i === menuId.length - 1) {
        values += `(${role_id},${menuId[i]})`
        continue
      }
      values += `(${role_id},${menuId[i]}),`
    }
  } else {
    values = `(${role_id},${menuId[0]})`
  }
  let deletemenu = new Promise((resolve, reject) => {
    let sql = `DELETE FROM role_menu WHERE role_id = ${role_id}`
    query(sql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(1)
    })
  })

  deletemenu.then(result=>{
    let sql = `INSERT INTO role_menu (role_id,menuId) VALUES ${values}`
    console.log(sql)
    query(sql, (err, results, fields) => {
      if (err) console.error(err)
      if (results.affectedRows > 0) {
        res.send({ code: 20000, msg: "设置成功" })
      } else {
        res.send({ code: 10000, msg: "设置失败" })
      }
    })
  })
}

