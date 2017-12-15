const query = require("../../module/sqlpool.js")
const permissionLevel = require("../../module/getUserInfo.js").permissionLevel
const getUserId = require("../../module/getUserInfo.js").userId

exports.getPayforOrder = function (req, res) {
  console.log("getPayforOrder")
  const Level = permissionLevel(req)
  const UserId = getUserId(req)
  switch (Level) {
    case 6:
      var pageSql = `SELECT payfor_id FROM payfororder WHERE fk_id IN (SELECT u_id FROM user WHERE superior = ${UserId}) `
      var sqltatil = ` WHERE p.fk_id IN (SELECT u_id FROM user WHERE superior = ${UserId}) `
      break;
    case 1:
    case 2:
    case 5:
      var pageSql = `SELECT payfor_id FROM payfororder`
      var sqltatil = ""
      break;
    case 7:
      var pageSql = `SELECT payfor_id FROM payfororder WHERE fk_id = ${UserId} `
      var sqltatil = ` WHERE p.fk_id = ${UserId} `
      break;
  }

  let pagePromise = new Promise((resolve, reject) => {
    console.log(pageSql)
    query(pageSql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.length)
    })
  })
  pagePromise.then((result) => {
    let curPage = req.query.pageNum
    let pageSize = req.query.pageSize
    if (result === 0) {
      return res.send({
        'code': 20000,
        'msg': "已放款客户为空",
        'data': {
          list: [],
          pageNum: Number(curPage),
          pageSize: Number(pageSize),
          totalItems: Number(result)
        }
      })
    } else {
      if (result < pageSize) {
        var sqltatil1 = ` ORDER BY payfor_id DESC LIMIT ${result * (curPage - 1)},${result}`
      } else {
        var sqltatil1 = ` ORDER BY payfor_id DESC LIMIT ${pageSize * (curPage - 1)},${pageSize}`
      }
      let sql = `SELECT DISTINCT
            o.id,
            o.customerName,
            o.businessBigType,
            o.customerId,
            o.businessSmallType,
            o.businessRequire,
            o.tip,
            o.lr_renyuan,
            u.u_username as fk_name,
            o.acceptData,
            o.proNewdata,tip,
            p.payforChannel,
            p.paybackWay,
            p.payforMoney,
            p.limitDate,
            p.paybackPoint,
            p.contractNum,
            p.payfor_id,
            p.pay_date,
            p.lookBZ,
            p.lookSure,
            p.sellBZ,
            p.sellSure,
            p.caiwuBZ,
            p.caiwuSure,
            p.dabaoBZ,
            p.dabaoSure
            FROM
            payfororder p
            LEFT JOIN orderyuegui o ON p.customerId = o.customerId AND p.fk_id = o.fk_id
            LEFT JOIN user u ON u.u_id = p.fk_id`;/* ORDER BY id DESC */
      sql += sqltatil
      sql += sqltatil1
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        let len = results.length
        if (Level !== 1 || Level !== 4) {
          for (let i = 0; i < len; i++) {
            delete results[i].customerTel
          }
        }
        res.send({
          code: 20000,
          msg: "获取成功",
          data: {
            list: results,
            pageNum: Number(curPage),
            pageSize: Number(pageSize),
            totalItems: Number(result)
          }
        })
      })
    }
  })

}
// router.get("/order/getAllorder",(req,res)=>{})
