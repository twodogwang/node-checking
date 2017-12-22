const query = require("../../module/sqlpool.js");
const info = require("../../module/getUserInfo.js").userInfo
exports.admininfo = function (req, res) {
  console.log("admininfo")
  const userInfo = info(req)
  const Level = userInfo.permissionLevel
  /* 
    获取用户信息
    炒鸡管理员获取所有人
    风控和营销主管获取自己+下属
    其他人获取自己
  */
  switch (Level) {
    case 1:
      var sqltatil = ""
      break;
    case 3:
    case 2:
    case 6:
      var sqltatil = ` WHERE u.u_id = ${userInfo.u_id} OR u.superior = ${userInfo.u_id}`
      break;
    default:
    var sqltatil = ` WHERE u.u_id = ${userInfo.u_id}`
      break;
  }
  let sql = `SELECT
    u.u_id,
    u.u_username,
    u.tel,
    u.email,
    u.u_bz,
    u.permissionLevel,
    r.role_name
    FROM
    user AS u
    INNER JOIN user_role AS ur ON u.u_id = ur.u_id
    INNER JOIN role AS r ON ur.role_id = r.role_id`
    sql += sqltatil
    console.log(sql)
  query(sql, (err, results, fields) => {
    if (err) console.error(err)
    res.send({ 'code': 20000, 'msg': "获取成功", 'data': results });
  })
}
