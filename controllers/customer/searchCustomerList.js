const query = require("../../module/sqlpool.js");
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetUsername = require("../../module/getUserInfo.js").username

exports.searchCustomerList = function (req, res) {
  console.log("searchCustomerList")
  const Level = GetpermissionLevel(req)
  const userID = GetuserID(req)
  const username = GetUsername(req)
  const searchString = req.body.searchString
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  /*
    客户搜索：
    1： searchString ， startDate ，endDate 都存在时，搜索 startDate 和 endDate 两个时间段之间的符合searchString的客户，searchString可能是录入人员，可能是客户姓名
    2：只有searchString ， startDate  获取 startDate 这个日期的客户
    3：只有searchString 获取 符合 searchString 的客户
    4：只有  startDate 和 endDate 获取 这个时间段的所有客户
    5：只有 startDate 获取 startDate 这个时间段客户

    注意！！ startDate ，endDate 的格式是  2017-12-21 这样的，没有时分秒
      搜索的等级限制看意向客户里
   */

  if (Level === 3) {
    var total = `SELECT c.customerId FROM customer c `
    if (searchString && searchString !== "" && startDate && startDate !== "" && endDate && endDate !== "") {
      var searchSqltatil = ` WHERE (c.lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${searchString}")
        AND (SELECT superior FROM user WHERE u_username = "${searchString}") = ${userID} AND c.m_addtime >= "${startDate}" AND c.m_addtime < "${endDate}")
        OR (c.c_name = "${searchString}" AND (SELECT superior FROM user WHERE u_id = (SELECT lr_renyuan FROM customer WHERE c_name = "${searchString}")) = ${userID} AND c.m_addtime >= "${startDate}" AND c.m_addtime < "${endDate}")`
    } else if (searchString && searchString !== "" && startDate && startDate !== "") {
      var searchSqltatil = ` WHERE (c.lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${searchString}")
        AND ${userID} = (SELECT superior FROM user WHERE u_username = "${searchString}"))
        OR (c.c_name = "${searchString}" AND (SELECT superior FROM user WHERE u_id = (SELECT lr_renyuan FROM customer WHERE c_name = "${searchString}")) = ${userID})
        AND m_addtime LIKE "%${startDate}%"`
    } else if (searchString && searchString !== "") {
      var searchSqltatil = ` WHERE (c.lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${searchString}")
        AND ${userID} = (SELECT superior FROM user WHERE u_username = "${searchString}"))
        OR (c.c_name = "${searchString}" AND (SELECT superior FROM user WHERE u_id = (SELECT lr_renyuan FROM customer WHERE c_name = "${searchString}")) = ${userID})`
    } else if (startDate && startDate !== "" && endDate && endDate !== "") {
      var searchSqltatil = ` WHERE m_addtime >= "${startDate}" AND m_addtime < "${endDate}" AND c.lr_renyuan in (SELECT u_id FROM user WHERE superior = ${userID})`
    } else if (startDate && startDate !== "") {
      var searchSqltatil = ` WHERE m_addtime LIKE "%${startDate}%" AND c.lr_renyuan in (SELECT u_id FROM user WHERE superior = ${userID})`
    }
    total += searchSqltatil
    let sellecttotal = new Promise((resolve, reject) => {
      console.log(total)
      query(total, (err, results, fields) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
    sellecttotal.then((result) => {
      let curPage = req.body.pageNum
      let pageSize = req.body.pageSize
      if (result === 0) {
        return res.send({
          'code': 20000,
          'msg': "搜索结果为空",
          'data': {
            list: [],
            pageNum: Number(curPage),
            pageSize: Number(pageSize),
            totalItems: Number(result)
          }
        })
      }
      if (result < pageSize) {
        var sqltatil = ` LIMIT ${result * (curPage - 1)},${result}`
      } else {
        var sqltatil = ` LIMIT ${pageSize * (curPage - 1)},${pageSize}`
      }
      let sql = `
SELECT
c.customerId,
c.ifcome,
c.c_name,
u.u_username,
date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
c.who,
c.c_mean,
c.done,
c.kf_tel,
c.kf_tel_bz,
c.c_bz,
c.done_time,
oo.proType,
oo.acceptData
FROM customer c
LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
LEFT JOIN user u ON u.u_id = c.lr_renyuan`

      sql += searchSqltatil + ` ORDER BY c.customerId DESC `
      sql += sqltatil
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        var customer_list = results;
        for (let j = 0; j < customer_list.length; j++) {
          customer_list[j].orderlist = [];
        }
        var ordersql = `
            SELECT
            customerId,
            payfor_id,
            sellSure
            FROM
            payfororder`;
        query(ordersql, function (err, results, fields) {
          if (err) console.log(err);
          for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < customer_list.length; j++) {
              if (results[i].customerId == customer_list[j].customerId) {
                customer_list[j].orderlist[customer_list[j].orderlist.length] = results[i]
              }
            }
          }
          res.send({
            'code': 20000,
            'msg': "搜索成功",
            'data': {
              list: customer_list,
              pageNum: Number(curPage),
              pageSize: Number(pageSize),
              totalItems: Number(result)
            }
          })
        })
      })
    })

  } else if (Level === 4) {
    var total = `SELECT c.customerId FROM customer c `
    if (searchString && searchString !== "" && startDate && startDate !== "" && endDate && endDate !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = ${userID} OR c.kf_tel = "${username}") AND c.c_name = "${searchString}" AND c.m_addtime >= "${startDate}" AND c.m_addtime < "${endDate}"`
    } else if (searchString && searchString !== "" && startDate && startDate !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = ${userID} OR c.kf_tel = "${username}") AND c.c_name = "${searchString}" AND c.m_addtime LIKE "%${startDate}%"`
    } else if (searchString && searchString !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = ${userID} OR c.kf_tel = "${username}") AND c.c_name = "${searchString}"`
    } else if (startDate && startDate !== "" && endDate && endDate !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = ${userID} OR c.kf_tel = "${username}") AND c.m_addtime >= "${startDate}" AND c.m_addtime < "${endDate}"`
    } else if (startDate && startDate !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = ${userID} OR c.kf_tel = "${username}") AND c.m_addtime LIKE "%${startDate}%"`
    }
    total += searchSqltatil
    let sellecttotal = new Promise((resolve, reject) => {
      query(total, (err, results, fields) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
    sellecttotal.then((result) => {
      let curPage = req.body.pageNum
      let pageSize = req.body.pageSize
      console.log("curPage", curPage)
      console.log("pageSize", pageSize)
      if (result === 0) {
        return res.send({
          'code': 20000,
          'msg': "搜索结果为空",
          'data': {
            list: [],
            pageNum: Number(curPage),
            pageSize: pageSize,
            totalItems: result
          }
        })
      }
      if (result < pageSize) {
        var sqltatil = ` LIMIT ${result * (curPage - 1)},${result}`
      } else {
        var sqltatil = ` LIMIT ${pageSize * (curPage - 1)},${pageSize}`
      }
      let sql = `
SELECT
c.customerId,
c.ifcome,
c.c_name,
date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
c.who,
c.c_mean,
c.c_tel,
c.done,
c.kf_tel,
c.kf_tel_bz,
c.c_bz,
u.u_username,
c.done_time,
oo.proType,
oo.acceptData
FROM customer c
LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
LEFT JOIN user u ON u.u_id = c.lr_renyuan `
      sql += searchSqltatil + ` ORDER BY c.customerId DESC `
      sql += sqltatil
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        var customer_list = results;
        for (let j = 0; j < customer_list.length; j++) {
          customer_list[j].orderlist = [];
        }
        var ordersql = `
            SELECT
            customerId,
            payfor_id,
            sellSure
            FROM
            payfororder`;
        query(ordersql, function (err, results, fields) {
          if (err) console.log(err);
          for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < customer_list.length; j++) {
              if (results[i].customerId == customer_list[j].customerId) {
                customer_list[j].orderlist[customer_list[j].orderlist.length] = results[i]
              }
            }
          }
          res.send({
            'code': 20000,
            'msg': "你看吧",
            'data': {
              list: customer_list,
              pageNum: Number(curPage),
              pageSize: Number(pageSize),
              totalItems: Number(result)
            }
          })
        })
      })
    })
  } else {
    var total = `SELECT c.customerId FROM customer c `
    if (searchString && searchString !== "" && startDate && startDate !== "" && endDate && endDate !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${searchString}") OR c.kf_tel = "${searchString}" OR c.c_name = "${searchString}") AND c.m_addtime >= "${startDate}" AND c.m_addtime < "${endDate}"`
    } else if (searchString && searchString !== "" && startDate && startDate !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${searchString}") OR c.kf_tel = "${searchString}" OR c.c_name = "${searchString}") AND c.m_addtime LIKE "%${startDate}%"`
    } else if (searchString && searchString !== "") {
      var searchSqltatil = `WHERE (c.lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${searchString}") OR c.kf_tel = "${searchString}" OR c.c_name = "${searchString}")`
    } else if (startDate && startDate !== "" && endDate && endDate !== "") {
      var searchSqltatil = `WHEREc.m_addtime >= "${startDate}" AND c.m_addtime < "${endDate}"`
    } else if (startDate && startDate !== "") {
      var searchSqltatil = `WHERE c.m_addtime LIKE "%${startDate}%"`
    }
    total += searchSqltatil
    console.log(total)
    let sellecttotal = new Promise((resolve, reject) => {
      query(total, (err, results, fields) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
    sellecttotal.then((result) => {
      let curPage = Number(req.body.pageNum)
      let pageSize = Number(req.body.pageSize)
      if (result === 0) {
        return res.send({
          'code': 20000,
          'msg': "已转移客户为空",
          'data': {
            list: [],
            pageNum: Number(curPage),
            pageSize: Number(pageSize),
            totalItems: Number(result)
          }
        })
      }
      if (result < pageSize) {
        var sqltatil = ` LIMIT ${result * (curPage - 1)},${result}`
      } else {
        var sqltatil = ` LIMIT ${pageSize * (curPage - 1)},${pageSize}`
      }
      let sql = `
SELECT
c.customerId,
c.ifcome,
c.c_name,
date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
c.who,
c.c_mean,
c.done,
c.kf_tel,
c.kf_tel_bz,
c.c_bz,
u.u_username,
c.done_time,
oo.proType,
oo.acceptData`
      if (Level == 1) {
        var sql2 = `,c.c_tel`
      } else {
        var sql2 = ``
      }
      var sql3 = `
FROM customer c
LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
LEFT JOIN user u ON u.u_id = c.lr_renyuan `
      sql += sql2
      sql += sql3
      sql += searchSqltatil + ` ORDER BY c.customerId DESC `
      sql += sqltatil
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        var customer_list = results;
        for (let j = 0; j < customer_list.length; j++) {
          customer_list[j].orderlist = [];
        }
        var ordersql = `
            SELECT
            customerId,
            payfor_id,
            sellSure
            FROM
            payfororder`+ sqltatil;
        query(ordersql, function (err, results, fields) {
          if (err) console.log(err);
          for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < customer_list.length; j++) {
              if (results[i].customerId == customer_list[j].customerId) {
                customer_list[j].orderlist[customer_list[j].orderlist.length] = results[i]
              }
            }
          }
          res.send({
            'code': 20000,
            'msg': "获取成功",
            'data': {
              list: customer_list,
              pageNum: Number(curPage),
              pageSize: Number(pageSize),
              totalItems: Number(result)
            }
          })
        })
      })
    })
  }
}
// router.get("/customer/serch",(req,res)=>{})
