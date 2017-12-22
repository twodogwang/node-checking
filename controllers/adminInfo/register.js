

const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const getUserInfo = require("../../module/getUserInfo.js").userInfo

exports.register = function (req, res) {
  console.log("register")
  /*
    添加用户
    炒鸡管理员能添加所有
    风控和营销只能添加自己的下属
   */
  const info = getUserInfo(req)
  const Level = info.permissionLevel
  let u_username = req.body.u_username
  let beforregister = new Promise((reslove, reject) => {
    let sql = `SELECT u_username FROM user WHERE u_username = "${u_username}"`
    query(sql, (err, results, fields) => {
      if (err) console.error(err)
      if (results.length > 0) {
        reslove(2)
      } else {
        reslove(1)
      }
    })
  })
  beforregister.then(result => {
    if (result == 1) {
      let permissionLevel = Number(req.body.permissionLevel)
      if (Level !== 1){
        if (permissionLevel !== Level + 1) {
          return res.send({
            code:10000,
            msg: "你只能添加权限等级为" + (Level + 1) + "员工"
          })
        }
      }
      let u_password = secret(req.body.u_password)
      let tel = req.body.tel
      let email = req.body.email
      let u_bz = req.body.u_bz
      let superior = req.body.superior

      let sql = `INSERT INTO user (u_username,u_password,tel,email,u_bz,superior,permissionLevel) VALUES ("${u_username}","${u_password}","${tel}","${email}","${u_bz}",${superior},${permissionLevel})`
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) console.error(err)
        let role_id = req.body.role_id
        let sql2 = `INSERT INTO user_role (u_id,role_id) VALUES (${results.insertId},${role_id})`
        query(sql2, (err, results, fields) => {
          if (err) console.error(err)
          res.send({ 'code': 20000, 'msg': "添加成功" });
        })

      })
    } else {
      res.send({ 'code': 10000, 'msg': "该用户已存在" });
    }
  })
}
