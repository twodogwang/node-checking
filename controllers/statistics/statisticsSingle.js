const query = require("../../module/sqlpool.js");
const now = require("../time");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.statisticsSingle = (req, res) => {
  const info = getUserInfo(req)
  const u_username = req.body.u_username
  /* 
    获取单个录入员的录入情况按日期分
  */
  let sql = `SELECT u.u_id,u.u_username,count(*) as num,date_format(c.m_addtime,'%Y-%m') as time
  FROM customer c
  LEFT JOIN user u ON u.u_id = c.lr_renyuan
  WHERE u.u_username = "${u_username}"
  GROUP BY time ORDER BY c.customerId DESC`
  query(sql, (err, results, fields) => {
    if (err) return console.error(err)
    res.send({
      code:20000,
      msg:"获取成功",
      data:{
        list:results
      }
    })
  })
}
