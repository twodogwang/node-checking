const query = require("../../module/sqlpool.js")
const GetUserInfo = require("../../module/getUserInfo.js").userInfo
exports.changeProType = (req, res) => {
  console.log(req.body)
  const proType = req.body.proType;
  const customerId = req.body.customerId
  const orderId = req.body.id
  const UserInfo = GetUserInfo(req)
  const u_username = UserInfo.u_username
  const UserId = UserInfo.u_id
  console.log(req.body)
  console.log(proType == "已放款")
  if (proType === "已放款") {
    var payforChannel = req.body.payforChannel
    var paybackWay = req.body.paybackWay
    var payforMoney = req.body.payforMoney
    var limitDate = req.body.limitDate
    var paybackPoint = req.body.paybackPoint
    var mysql = `INSERT INTO payfororder (customerId,payforChannel,paybackWay,payforMoney,limitDate,paybackPoint,pay_date,fk_id,ManagerId) VALUES (${customerId},"${payforChannel}","${paybackWay}",${payforMoney},"${limitDate}",${paybackPoint},NOW(),${UserId},(SELECT superior FROM user WHERE u_id = ${UserId}))`;
    var fkzg_log_sql = `INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) values ("${u_username}修改了订单${orderId}的状态:已放款", "修改订单生产状态" ,NOW(),"${u_username}")`;
  } else if (proType === "退单") {
    var c_bz = req.body.c_bz
    var mysql = `UPDATE orderYuegui SET proType="${proType}",lastUpdate = NOW(),ifaccept = '1' WHERE id = ${orderId} AND proType !="已完成"`;
    var fkzg_log_sql = `INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) values ("${u_username}修改了订单${orderId}的状态:${proType}\n退单备注:${c_bz}", "修改订单生产状态" ,NOW(),"${u_username}")`;
  } else {
    var mysql = `UPDATE orderYuegui SET proType="${proType}",lastUpdate = NOW() WHERE id = ${orderId} AND proType !="已完成"`;
    var fkzg_log_sql = `INSERT INTO log_fkzg (to_who,log_bz,time,whoWrite) values ("${u_username}修改了订单${orderId}的状态:${proType}", "修改订单生产状态" ,NOW(),"${u_username}")`;
  }

  /* 填写日志 */
  const changeLog = new Promise((resolve, reject) => {
    console.log("修改生产状态日志sql:" + fkzg_log_sql);
    query(fkzg_log_sql, function (err, results, fields) {
      if (err) return console.log(err);
      resolve(results.affectedRows)
    });
  })

  /* 修改生产状态 */
  const changeProType1 = new Promise((resolve, reject) => {
    console.log("修改生产状态sql:" + mysql);
    query(mysql, function (err, results, fields) {
      if (err) return console.log(err);
      resolve(results.affectedRows)
    });
  })

  /* promise.all */
  Promise.all([changeLog, changeProType1]).then(result => {
    if (result[0] > 0 && result[1] > 0) {
      res.send({
        "code": 20000,
        "msg": "生产状态更改成功",
        superior:UserInfo.superior
      });
    } else {
      res.send({ "code": 10000, "msg": "生产状态更改失败" });
    }
  })
}
