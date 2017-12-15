const query = require("../../module/sqlpool.js");
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetUserName = require("../../module/getUserInfo.js").username;
const now = require("../time");

exports.sendCustomer = function (req, res) {
  var time = now.format("yyyy年MM月dd日 hh:mm:ss");
  const u_username = GetUserName(req)
  var paidan_name = req.body.u_username || "",
    customerId = req.body.customerId || "",
    c_name = req.body.c_name || "",
    log_bz = req.body.log_bz || "";
  var paidan_sql = `UPDATE customer SET kf_tel = "${paidan_name}",kf_tel_bz = "${time}:${log_bz}",come_rate = '1'  WHERE customerId = ${customerId}`;
  var log_sql = ` INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) VALUES ("${u_username}把客户${c_name}派给${paidan_name}","${log_bz}",NOW(),"${u_username}")`;
  console.log("客户派给客服sql:" + paidan_sql)
  console.log("客户派给客服日志sql:" + log_sql)
  let sendPromise = new Promise((resolve, reject) => {
    query(paidan_sql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    })
  })

  let logPromise = new Promise((resolve, reject) => {
    query(log_sql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    })
  })

  Promise.all([sendPromise, logPromise]).then((result) => {
    let sql = `SELECT u_id FROM user WHERE u_username = "${paidan_name}"`
    if (result[0] > 0 && result[1] > 0) {
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        res.send({
          code: 20000,
          msg: "派单成功",
          superior:results[0].u_id
        })
      })
    } else {
      res.send({ code: 10000, msg: "派单失败" })
    }
  })
}
