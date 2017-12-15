const query = require("../../module/sqlpool.js")
const GetUserInfo = require("../../module/getUserInfo.js").userInfo
const permissionLevel = require("../../module/getUserInfo.js").permissionLevel

exports.affirmOrder = (req, res) => {
  const time = new Date().format("yyyy-MM-dd hh:mm")
  const info = GetUserInfo(req)
  const payfor_id = req.body.payfor_id
  const Level = info.permissionLevel
  const affirmType = req.body.affirmType
  const affirmBz = req.body.affirmBz
  var sql = `UPDATE payfororder SET `;
  var sql3 = ` WHERE payfor_id = ${payfor_id}`;
  if (Level == 2) {
    var sql2 = `lookSure = '1',lookBZ = "${time}:\n${affirmBz}"`
    var beforCheck = `SELECT lookSure FROM payfororder`
    var canChecksql = `SELECT caiwuSure,caiwuSure2 FROM payfororder`
  } else if (Level == 5) {
    if (affirmType == 1) {
      var sql2 = `caiwuSure2 = '1',caiwuBZ = CONCAT(caiwuBZ,"${time}确认服务费:\n${affirmBz}")`
      var canChecksql = `SELECT sellSure FROM payfororder`
      var beforCheck = `SELECT caiwuSure2 FROM payfororder`
    } else {
      var sql2 = `caiwuSure = '1',caiwuBZ = CONCAT(caiwuBZ,"${time}确认返费:\n${affirmBz}")`
      var canChecksql = `SELECT dabaoSure FROM payfororder`
      var beforCheck = `SELECT caiwuSure FROM payfororder`
    }
  } else if (Level == 7) {
    var sql2 = `dabaoSure = '1',dabaoBZ = "${time}:\n${affirmBz}"`
    var beforCheck = `SELECT dabaoSure FROM payfororder`
  } else if (Level == 3) {
    var sql2 = `sellSure = '1',sellBZ = "${time}:\n${req.body.sellBZ}"`
    var beforCheck = `SELECT sellSure FROM payfororder`
    /*  var canChecksql = `SELECT caiwuSure FROM payfororder` */
  }
  beforCheck += sql3;
  canChecksql += sql3;
  let canCheck = new Promise((resolve, reject) => {
    if (Level == 7 || Level == 3) {
      resolve(1)
    } else {
      if (Level == 2) {
        query(canChecksql, function (err, results, fields) {
          if (err) return console.log(err);
          resolve(results[0])
        })
      } else {
        query(canChecksql, function (err, results, fields) {
          if (err) return console.log(err);
          var Sure = Object.values(results[0])[0]
          resolve(Sure)
        })
      }

    }
  })
  canCheck.then(result => {
    if (Level == 2) {
      if (result.caiwuSure == '0' || result.caiwuSure2 == '0') {
        var msg = "财务未确认"
        res.send({ code: 30000, msg: msg })
      } else {
        console.log(beforCheck)
        query(beforCheck, function (err, results, fields) {
          if (err) console.log(err);
          var a = Object.values(results[0])[0]
          if (a == "1") {
            res.send({ code: 10000, msg: "你已确认过" })
          } else {
            sql += sql2;
            sql += sql3;
            console.log(sql)
            query(sql, function (err, results, fields) {
              if (err) console.log(err);
              res.send({
                code: 20000,
                msg: "确认成功"
              })
            });
          }
        });
      }
    } else if (result == "0") {
      if (Level == 5) {
        if (affirmType == "1") {
          var msg = "营销主管未确认"
        } else {
          var msg = "风控专员未确认"
        }
      } else if (Level == 2) {
        var msg = "财务未确认"
      } /* else if (Level == 3) {
        var msg = "财务未确认"
      } */
      res.send({ code: 30000, msg: msg })
    } else {
      console.log(beforCheck)
      query(beforCheck, function (err, results, fields) {
        if (err) console.log(err);
        var a = Object.values(results[0])[0]
        if (a == "1") {
          return res.send({ code: 10000, msg: "你已确认过" })
        } else {
          sql += sql2;
          sql += sql3;
          console.log(sql)
          query(sql, function (err, results, fields) {
            if (err) console.log(err);
            if (Level == 7 || Level == 3) {
              let caiwuIDsql = `SELECT u_id FROM user WHERE permissionLevel = 5`
              query(caiwuIDsql, (err, results, fields) => {//获取财务ID以推送
                if (err) return console.error(err)
                const caiwuArr = [];
                let len = results.length
                if (len > 1) {
                  for (let i = 0; i < len; i++) {
                    caiwuArr.push(results[i].u_id)
                  }
                } else {
                  caiwuArr.push(results[0].u_id)
                }
                if (Level == 3) {
                  res.send({
                    code: 20000,
                    msg: "确认成功",
                    superior: caiwuArr
                  })
                } else {
                  res.send({
                    code: 20000,
                    msg: "确认成功",
                    superior: caiwuArr,
                    message: `${info.u_username}确认了订单${payfor_id}已到账`
                  })
                }
              })
            } else if (Level == 5) {
              let sql = `SELECT caiwuSure,caiwuSure2 FROM payfororder WHERE payfor_id = ${payfor_id}`
              query(sql, (err, results, fields) => {
                if (err) return console.error(err)
                console.log(results[0].caiwuSure)
                console.log(results[0].caiwuSure2)
                if (results[0].caiwuSure == 1 && results[0].caiwuSure2 == 1) {
                  let jianduArr = `SELECT u_id FROM user WHERE permissionLevel = 2`//获取监督id以推送
                  query(jianduArr, (err, results, fields) => {
                    if (err) return console.error(err)
                    let idArr = []
                    let len = results.length
                    if (len > 1) {
                      for (let i = 0; i < len; i++) {
                        idArr.push(results[i].u_id)
                      }
                    } else {
                      idArr.push(results[0].u_id)
                    }
                    res.send({
                      code: 20000,
                      msg: "确认成功",
                      superior: idArr,
                      message: `${info.u_username}确认了订单${payfor_id}已全部到账`
                    })
                  })
                } else {
                  res.send({
                    code: 20000,
                    msg: "确认成功"
                  })
                }
              })
            }
          });
        }
      });
    }
  })
}
