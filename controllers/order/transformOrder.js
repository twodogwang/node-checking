const query = require("../../module/sqlpool.js");
const GetUserInfo = require("../../module/getUserInfo.js").userInfo

exports.transformOrder = function (req, res) {
  console.log("transformOrder")
  const userInfo = GetUserInfo(req)
  const u_username = userInfo.u_username
  const orderId = req.body.id
  const fk_id = req.body.fk_id
  const customerId = req.body.customerId
  const fk_name = req.body.u_username
  const c_bz = req.body.c_bz
  /* 
    转移订单，
    风控主管将订单转移给自己手下的风控专员，同时推送消息
  */
  const mysql = `UPDATE orderYuegui SET ifaccept = '1',acceptData=NOW(),fk_id=${fk_id},proType="跟进中" WHERE id = ${orderId} AND proType !="已放款"`;
  console.log("风控主管转移订单sql:" + mysql);
  const updateCbz = `UPDATE customer SET c_bz= CONCAT(c_bz,"\n${u_username}备注:${c_bz}") WHERE customerId =  ${customerId}`
  const fkzg_log_sql = ` INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) VALUES ("风控主管${u_username}转移了订单${orderId}给${fk_name}", "转移订单" ,NOW(),"${u_username}")`;

  /* 填写日志 */
  const writeLog = new Promise(function (resolve, reject) {
    query(fkzg_log_sql, function (err, results, fields) {
      if (err) return console.log(err);
      console.log("风控主管转移订单日志sql:" + fkzg_log_sql);
      resolve(results.affectedRows);
    });
  });

  /* 修改订单 */
  const updateOrderYuegui = new Promise(function (resolve, reject) {
    query(mysql, function (err, results, fields) {
      if (err) return console.log(err);
      resolve(results.affectedRows);
    });
  })

  /* 修改备注 */
  const upCustomerBz = new Promise((resolve, reject) => {
    query(updateCbz, function (err, results, fields) {
      if (err) return console.log(err);
      resolve(results.affectedRows)
    })
  })

  Promise.all([updateOrderYuegui, writeLog, upCustomerBz]).then(result => {
    if (result[0] > 0 && result[1] > 0 && result[2] > 0) {
      res.send({
        "code": 20000,
        "msg": "转移成功",
        superior:fk_id
      });
    } else {
      res.send({
        "code": 10000,
        "msg": "转移失败"
      });
    }
  }).catch(err => {
    return console.log(err)
  })
}
