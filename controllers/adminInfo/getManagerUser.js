const query = require("../../module/sqlpool.js");
exports.getManagerUser = function (req, res) {
  console.log("getManagerUser")
  /* 
    获取管理层 permissionLevel 为 1(炒鸡管理员) 2(监督) 3(营销主管) 6(风控主管) 的是管理层
  */
  let permissionLevel = req.query.permissionLevel
  switch (Number(permissionLevel)) {
    case 4:
      var sql2 = `WHERE u.permissionLevel = 3`
      break;
    case 7:
      var sql2 = `WHERE u.permissionLevel = 6`
      break;
    default:
      var sql2 = `WHERE u.permissionLevel IN (1,2,3,6)`
      break;
  }
  let sql = `SELECT
    u.u_username,
    u.u_id
    FROM
    user u `
  sql += sql2;
  console.log(sql)
  query(sql, (err, results, fields) => {
    if (err) console.error(err)
    res.send({ 'code': 20000, 'msg': "获取成功", 'data': results });
  })
}

