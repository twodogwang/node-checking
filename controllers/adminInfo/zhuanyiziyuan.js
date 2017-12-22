

const query = require("../../module/sqlpool.js");
const getUserInfo = require("../../module/getUserInfo.js").userInfo

exports.zhuanyiziyuan = function (req, res) {
  console.log("zhuanyiziyuan")
  const info = getUserInfo(req);
  const Level = info.permissionLevel
  const target = req.body.target
  const origin = req.body.origin
  /* 
    转移资源,把A的资源转移到B的资源
    如果A是营销,则把A所有录入的客户转到B下面
    如果A是营销主管,则把A手下的营销专员转到B下面
    不同级不能转
  */


  let beforZhuanYi1 = new Promise((resolve, reject) => {
    let originsql = `SELECT permissionLevel FROM user WHERE u_id = ${origin}`
    query(originsql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results[0].permissionLevel)
    })
  })

  let beforZhuanYi2 = new Promise((resolve, reject) => {
    let originsql = `SELECT permissionLevel FROM user WHERE u_id = ${target}`
    query(originsql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results[0].permissionLevel)
    })
  })
  Promise.all([beforZhuanYi1, beforZhuanYi2]).then(result => {
    if (result[1] === result[0]) {
      if (result[0] == 3) {
        var sql = `UPDATE user SET superior = ${target} WHERE superior = ${origin}`
      } else if (result[0] == 4) {
        var sql = `UPDATE customer SET lr_renyuan = ${target} WHERE lr_renyuan = ${origin} OR kf_tel = (SELECT u_username FROM user WHERE u_id = ${origin})`
      } else if (result[0] == 6) {
        var sql = `UPDATE user SET superior = ${target} WHERE superior = ${origin}`
        var sql2 = `UPDATE orderyuegui SET MangerId = ${target} WHERE MangerId = ${origin}`
        var sql3 = `UPDATE payfororder SET ManagerId = ${target} WHERE ManagerId = ${origin}`
      } else if (result[0] == 7) {
        var sql = `UPDATE orderyuegui SET fk_id = ${target} WHERE fk_id = ${origin}`
        var sql2 = `UPDATE payfororder SET fk_id = ${target} WHERE fk_id = ${origin}`
      }
      if (result[0] == 3 || result[0] == 4) {
        query(sql, (err, results, fields) => {
          if (err) return console.error(err)
          res.send({
            code: 20000,
            msg: "转移成功"
          })
        })
      } else if (result[0] == 6) {
        let p1 = new Promise((resolve, reject) => {
          query(sql, (err, results, fields) => {
            if (err) return console.error(err)
            resolve(results.affectedRows)
          })
        })
        let p2 = new Promise((resolve, reject) => {
          query(sql2, (err, results, fields) => {
            if (err) return console.error(err)
            resolve(results.affectedRows)
          })
        })
        let p3 = new Promise((resolve, reject) => {
          query(sql3, (err, results, fields) => {
            if (err) return console.error(err)
            resolve(results.affectedRows)
          })
        })
        Promise.all([p1, p2, p3]).then(results => {
          if (results[0] > 0 && results[1] > 0 && results[2] > 0) {
            res.send({
              code: 20000,
              msg: "转移成功"
            })
          } else {
            res.send({
              code: 10000,
              msg: "转移失败"
            })
          }
        })
      } else {
        let p1 = new Promise((resolve, reject) => {
          query(sql, (err, results, fields) => {
            if (err) return console.error(err)
            resolve(results.affectedRows)
          })
        })
        let p2 = new Promise((resolve, reject) => {
          query(sql2, (err, results, fields) => {
            if (err) return console.error(err)
            resolve(results.affectedRows)
          })
        })
        Promise.all([p1, p2]).then(results => {
          if (results[0] > 0 && results[1] > 0) {
            res.send({
              code: 20000,
              msg: "转移成功"
            })
          } else {
            res.send({
              code: 10000,
              msg: "转移失败"
            })
          }
        })
      }
    } else {
      res.send({
        code: 10000,
        msg: "资源只能转移给同一级员工"
      })
    }
  })
}

