const query = require("../../module/sqlpool.js");
/* const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel; */
const GetUserName = require("../../module/getUserInfo.js").username;
const now = require("../time");
//客户信息移出
/* 
  将客户移入公海
*/
exports.customerOut = function (req, res) {
  const username = GetUserName(req)
  const time = now.format("yyyy年MM月dd日 hh:mm:ss");
  const change_sql = `UPDATE customer SET come_rate = '0', ifcome = '0' WHERE customerId = ${req.body.customerId}`;
  const fkzg_log_sql = ` INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) values ("客服主管${username}移出了客户${req.body.c_name}", "移出客户信息" ,NOW(),"${username}")`;
  console.log("客户移出日志sql:" + fkzg_log_sql)
  let logPromise = new Promise((resolve, reject) => {
    query(fkzg_log_sql, function (err, results, fields) {
      if (err) return console.error(err);
      resolve(results.affectedRows)
    });
  })
  let UPDATEpromise = new Promise((resolve, reject) => {
    query(change_sql, function (err, results, fields) {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    });
  })
  Promise.all([logPromise, UPDATEpromise]).then((results) => {
    if (results[0] > 0 && results[1] > 0) {
      res.send({
        code: 20000,
        msg: "客户已移入公海"
      })
    } else {
      res.send({
        code: 10000,
        msg: "客户移入公海失败"
      })
    }
  })
}
