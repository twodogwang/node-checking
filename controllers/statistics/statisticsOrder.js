const query = require("../../module/sqlpool.js");
const now = require("../time");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.statisticsOrder = (req, res) => {
  const info = getUserInfo(req)
  const Level = info.permissionLevel
  const sql1 = `SELECT proType,DATE_FORMAT(proNewdata,'%Y_%u') weeks,count(*) AS num FROM orderyuegui GROUP BY proType ORDER BY weeks`
  const sql2 = `SELECT DATE_FORMAT(pay_date,'%Y_%u') weeks,COUNT(*) AS num FROM payfororder GROUP BY weeks ORDER BY weeks`
  /* 
    统计订单，按周，按订单分类统计，前端用了冒泡排序
  */
  const order1 = new Promise((resolve, reject) => {
    query(sql1, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results)
    })
  })
  const order2 = new Promise((resolve, reject) => {
    query(sql2, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results)
    })
  })
  Promise.all([order1, order2]).then((results) => {
    res.send({
      code: 20000,
      msg: "获取成功",
      data: {
        order1: results[0],
        order2: results[1]
      }
    })
  })
}
