const query = require("../../module/sqlpool.js");
exports.setpermission = function (req, res) {
  console.log("setpermission")
  const permissionID = req.body.permissionId
  const role_id = req.body.role_id
  let values = "";
  if (permissionID.length > 1) {
    for (let i = 0; i < permissionID.length; i++) {
      if (i === permissionID.length - 1) {
        values += `(${role_id},${permissionID[i]})`
        continue
      }
      values += `(${role_id},${permissionID[i]}),`
    }
  } else {
    values = `(${role_id},${permissionID[0]})`
  }
  let deleteP = new Promise((resolve, reject) => {
    let sql = `DELETE FROM role_permission WHERE role_id = ${role_id}`
    query(sql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(1)
    })
  })
  deleteP.then(()=>{
    let sql = `INSERT INTO role_permission (role_id,permission_id) VALUES ${values}`
    query(sql, (err, results, fields) => {
      if (err) console.error(err)
      if (results.affectedRows > 0) {
        res.send({ code: 20000, msg: "设置成功" })
      }else{
        res.send({ code: 10000, msg: "设置失败" })
      }
    })
  })

}

