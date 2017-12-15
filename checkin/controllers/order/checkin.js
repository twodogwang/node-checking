const query = require("../../module/sqlpool.js")
const GetUserInfo = require("../../module/getUserInfo.js").userInfo
/* const permissionLevel = require("../../module/getUserInfo.js").permissionLevel
const getUserId = require("../../module/getUserInfo.js").userId */

exports.checkin = function (req, res) {
  console.log("checkin")
  const UserInfo = GetUserInfo(req)
  const Level = UserInfo.permissionLevel
  const UserId = UserInfo.u_id
  const u_username = UserInfo.u_username
  switch (Level) {
    case 6:
      var pageSql = `SELECT id FROM orderYuegui WHERE ifaccept = '1' AND ifpass = 1  AND ifback = '0' AND MangerId = ${UserId} AND (proType="暂缓" OR proType="审批中" OR proType="跟进中")`
      var sqltatil = ` AND MangerId = ${UserId} AND (proType="暂缓" OR proType="审批中" OR proType="跟进中")`
      break;
    case 1:
    case 2:
    case 5:
      var pageSql = `SELECT id FROM orderYuegui WHERE ifaccept = '1' AND ifpass = 1  AND ifback = '0' AND (proType="暂缓" OR proType="审批中" OR proType="跟进中")`
      var sqltatil = ` AND (proType="暂缓" OR proType="审批中" OR proType="跟进中")`
      break;
    case 7:
      var pageSql = `SELECT id FROM orderYuegui WHERE ifaccept = '1' AND ifpass = 1 AND ifback = '0' AND fk_id = ${UserId} AND (proType="暂缓" OR proType="审批中" OR proType="跟进中")`
      var sqltatil = ` AND fk_id = ${UserId} AND (proType="暂缓" OR proType="审批中" OR proType="跟进中")`
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
        code: 20000,
        msg: "跟进中客户为空",
        data: {
          list: [],
          pageNum: Number(curPage),
          pageSize: Number(pageSize),
          totalItems: Number(result)
        }
      })
    } else {
      if (result < pageSize) {
        var sqltatil1 = ` ORDER BY id DESC LIMIT ${result * (curPage - 1)},${result}`
      } else {
        var sqltatil1 = ` ORDER BY id DESC LIMIT ${pageSize * (curPage - 1)},${pageSize}`
      }
      let sql = `SELECT
            o.id,
            o.proNum,
            o.customerName,
            o.businessBigType,
            o.businessSmallType,
            o.businessRequire,
            o.dianziRequire,
            o.way,
            o.lr_renyuan,
            o.proType,
            o.proSchedule,
            o.dianziSchedule,
            o.acceptData,
            o.lastUpdate,
            o.customerId,
            o.proNewdata,
            o.tip,
            u.u_username as fk_name
            FROM orderYuegui o
            LEFT JOIN user u ON u.u_id = o.fk_id
            WHERE
            ifaccept = '1' AND ifpass = '1'  AND ifback = '0' `;/* ORDER BY id DESC */
      sql += sqltatil
      sql += sqltatil1
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        let len = results.length
        if (Level !== 1) {
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
