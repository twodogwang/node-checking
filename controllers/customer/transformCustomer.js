const query = require("../../module/sqlpool.js");
/* const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel; */
const GetUserName = require("../../module/getUserInfo.js").username;

exports.transformCustomer = function (req, res) {
  const turnId = req.body.u_id
  const customerId = req.body.customerId
  const u_username = GetUserName(req)
  const change_sql = `UPDATE customer SET ifcome = 1,fkManager = ${turnId},c_mean = "已转移客户",c_bz = CONCAT(c_bz,"\n${u_username}备注:${req.body.sellerBz}")  WHERE customerId = ${customerId} `;
  const fkzg_log_sql = ` INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) values ("${u_username}转移了客户${req.body.c_name}给${req.body.u_username}", "转移客户信息" ,NOW(),"${u_username}")`;
  const mysql = `UPDATE orderYuegui SET ifpass = '1',MangerId=${turnId},proType="待接收" WHERE customerId = ${customerId}`;
  console.log("转移客户sql:" + change_sql)
  console.log("转移客户日志sql:" + fkzg_log_sql);
  console.log("插入订单sql:" + mysql);
  let UPDATEpromise = new Promise((resolve, reject) => {
    query(change_sql, function (err, results, fields) {
      if (err) return console.log(err)
      resolve(results.affectedRows)
    })
  })
  let logPromise = new Promise((resolve, reject) => {
    query(fkzg_log_sql, function (err, results, fields) {
      if (err) return console.log(err)
      resolve(results.affectedRows)
    });
  })
  let INSERTorder = new Promise((resolve, reject) => {
    query(mysql, function (err, results, fields) {
      if (err) return console.log(err)
      resolve(results.affectedRows)
    })
  })
  Promise.all([UPDATEpromise, logPromise, INSERTorder]).then((results) => {
    if (results[0] > 0 && results[1] > 0 && results[2] > 0) {
      res.send({
        code: 20000,
        msg: "转移成功",
        superior: turnId
      })
    } else {
      res.send({
        code: 10000,
        msg: "转移失败"
      })
    }
  })
}

