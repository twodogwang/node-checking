

const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;
const getUserInfo = require("../../module/getUserInfo.js").userInfo

exports.editManager = function (req, res) {
  console.log("editManager")
  const info = getUserInfo(req)
  const u_id = info.u_id
  const u_username = req.body.u_username
  const u_password = secret(req.body.u_password)
  const tel = req.body.tel
  const email = req.body.email
  const u_bz = req.body.u_bz
  const superior = req.body.superior
  const Level = req.body.permissionLevel
  /* 
    编辑用户信息:炒鸡管理员可以随便改,风控和营销主管只能改自己和属下的信息
    其他人只能改自己的信息,而且不能改分组和权限等级
  */
  const editManager = new Promise((reslove, reject) => {
    if(u_id == req.body.u_id){
      var sql = `UPDATE user SET u_username = "${u_username}",u_password="${u_password}",tel = "${tel}",email="${email}",u_bz="${u_bz}"
        WHERE u_id = ${req.body.u_id}`
    }else{
      var sql = `UPDATE user SET u_username = "${u_username}",u_password="${u_password}",tel = "${tel}",
      email="${email}",u_bz="${u_bz}",superior = ${superior},permissionLevel = ${Level}
        WHERE u_id = ${req.body.u_id}`
    }
    console.log(sql)
    query(sql, (err, results, fields) => {
      if (err) console.error(err)
      if (results.length > 0) {
        reslove(2)
      } else {
        reslove(1)
      }
    })
  })
  editManager.then(result => {
    if (result == 1) {
      if(u_id == req.body.u_id){
        return res.send({ 'code': 20000, 'msg': "修改成功" });
      }else{
        var sql2 = `UPDATE user_role SET role_id = ${req.body.role_id} WHERE u_id = ${req.body.u_id}`
      }
      console.log(sql2)
      query(sql2, (err, results, fields) => {
        if (err) console.error(err)
        res.send({ 'code': 20000, 'msg': "修改成功" });
      })

    } else {
      res.send({ 'code': 10000, 'msg': "修改失败" });
    }
  })
}

