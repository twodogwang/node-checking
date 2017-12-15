const query = require("../../module/sqlpool.js");
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetuserID = require("../../module/getUserInfo.js").userId;

exports.getOrder = (req, res) => {
  const Level = GetpermissionLevel(req)
  const payfor_id = req.query.payfor_id
  const customerId = req.query.customerId
  const UserId = GetuserID(req)
  if(Level == 3){
    var mysql = `
    SELECT
    p.payforChannel,
    p.paybackWay,
    p.payforMoney,
    p.limitDate,
    p.contractNum,
    u.u_username as fk_name,
    p.pay_date,
    p.caiwuBZ,
    p.sellBZ
    FROM payfororder p
    LEFT JOIN user u ON p.fk_id = u.u_id AND (SELECT superior FROM user WHERE u_id = (SELECT lr_renyuan FROM customer WHERE customerId = ${customerId}) ) = ${UserId}
    WHERE p.payfor_id = ${payfor_id} `;
  }else{
    var mysql = `
    SELECT
    p.payforChannel,
    p.paybackWay,
    p.payforMoney,
    p.limitDate,
    p.contractNum,
    u.u_username as fk_name,
    p.pay_date,
    p.caiwuBZ,
    p.sellBZ
    FROM payfororder p
    LEFT JOIN user u ON p.fk_id = u.u_id
    WHERE p.payfor_id = ${payfor_id} `;
  }
  console.log(mysql)
  query(mysql, function (err, results, fields) {
    if (err) return log1(err);
    let obj = {
      code: 20000,
      msg:"获取订单成功",
      data: results[0]
    }
    res.send(obj)
  });
}
