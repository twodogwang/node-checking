

const query = require("../../module/sqlpool.js");
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetuserName = require("../../module/getUserInfo.js").username;

exports.alreadyTransform = function (req, res) {
  console.log("waitForTransform")
  const Level = Number(GetpermissionLevel(req))
  const userID = Number(GetuserID(req))
  /* 
    获取已转移客户
    营销主管获取手下的人录入的
    营销专员只能获取自己录入的
    炒鸡管理员和监督专员能获取所有的
    只有超级管理员和营销专员能获取电话  即 c_tel 字段
  */
  if (Level === 3) {
    let sellecttotal = new Promise((resolve, reject) => {
      let total = `SELECT c.customerId FROM customer c
            LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
            WHERE c.come_rate = 1  AND c.c_mean = "已转移客户" AND (c.lr_renyuan in (SELECT u_id FROM user WHERE superior = ${userID}) OR (c.kf_tel IN (SELECT u_username FROM user WHERE superior = ${userID})))`
      query(total, (err, results, fields) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
    sellecttotal.then((result) => {
      let curPage = req.query.pageNum
      let pageSize = req.query.pageSize
      if (result === 0) {
        return res.send({
          'code': 20000,
          'msg': "已转移客户为空",
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
      let sql = `SELECT
                c.customerId,
                c.c_mean,
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
                LEFT JOIN user u ON u.u_id = c.lr_renyuan
                WHERE c.come_rate = 1  AND c.c_mean = "已转移客户" AND c.lr_renyuan in (SELECT u_id FROM user WHERE superior = ${userID})
                ORDER BY customerId DESC `
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
          if (err) log1(err);
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

  } else if (Level === 4) {
    let sellecttotal = new Promise((resolve, reject) => {
      let total = `SELECT c.customerId FROM customer c
            LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
            WHERE c.come_rate = 1  AND c.c_mean = "已转移客户" AND (c.lr_renyuan  = ${userID} OR c.kf_tel = "${GetuserName(req)}") `
      query(total, (err, results, fields) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
    sellecttotal.then((result) => {
      let curPage = req.query.pageNum
      let pageSize = req.query.pageSize
      if (result === 0) {
        return res.send({
          'code': 20000,
          'msg': "已转移客户为空",
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
      let sql = `SELECT
                c.customerId,
                c.c_mean,
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
                LEFT JOIN user u ON u.u_id = c.lr_renyuan
                WHERE c.come_rate = 1  AND c.c_mean = "已转移客户" AND c.lr_renyuan = ${userID}
                ORDER BY customerId DESC `
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
          if (err) log1(err);
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
  } else {
    let sellecttotal = new Promise((resolve, reject) => {
      let total = `SELECT c.customerId FROM customer c
            LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
            WHERE c.come_rate = 1  AND c.c_mean = "已转移客户"`
      query(total, (err, results, fields) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
    sellecttotal.then((result) => {
      let curPage = req.query.pageNum
      let pageSize = req.query.pageSize
      if (result === 0) {
        return res.send({
          'code': 20000,
          'msg': "已转移客户为空",
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
      let sql = `SELECT
                c.customerId,
                c.c_mean,
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
                oo.acceptData
                FROM customer c
                LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
                LEFT JOIN user u ON u.u_id = c.lr_renyuan
                WHERE c.come_rate = 1  AND c.c_mean = "已转移客户"
                ORDER BY customerId DESC `
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
          if (err) log1(err);
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


