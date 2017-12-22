const query = require("../../module/sqlpool.js");
const now = require("../time");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.statisticsCustomer = (req, res) => {
  const info = getUserInfo(req)
  const Level = info.permissionLevel
    var sql = `SELECT u.u_id,u.u_username,count(*) as num,c.c_mean    FROM customer c    LEFT JOIN user u ON u.u_id = c.lr_renyuan    GROUP BY c.c_mean,u.u_username ORDER BY u.u_username DESC`
  /* } else if (Level == 3) {
    const u_id = info.u_id
    var sql = `SELECT u.u_id,u.u_username,count(*) as num,c.c_mean
    FROM customer c
    LEFT JOIN user u ON u.u_id = c.lr_renyuan
    WHERE u.u_id IN (SELECT u_id FROM user WHERE superior = ${u_id})
    GROUP BY c.c_mean,u.u_username ORDER BY u.u_username DESC`
  } */
  /* 
    统计客户录入情况，根据录入人员统计
  */
  console.log(sql)
  query(sql, (err, results, fields) => {
    if (err) return console.error(err)
      res.send({
        code: 20000,
        msg: "获取统计成功",
        data: {
          list: results
        }
      })
  })
}
