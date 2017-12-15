const query = require("../../module/sqlpool.js");
const now = require("../time");
const userID = require("../../module/getUserInfo.js").userId;
const userName = require("../../module/getUserInfo.js").username;
exports.addOrder = function (req, res) {
  var customerName = req.body.c_name,
    customerTel = req.body.c_tel,
    businessBigType = req.body.businessBigType,
    businessSmallType = req.body.businessSmallType,
    businessRequire = req.body.businessRequire || "",
    dianziRequire = req.body.dianziRequire || "",
    way = req.body.way || "",
    customerId = req.body.customerId,
    lr_renyuan = userName(req),
    tip = req.body.tip,
    dianziSchedule = req.body.dianziSchedule || "";
  var mysql = `
    INSERT INTO orderYuegui (customerName,customerTel,businessBigType,businessSmallType,businessRequire,dianziRequire,way,lr_renyuan,dianziSchedule,customerId,proNewdata,tip)
    values ("${customerName}","${customerTel}","${businessBigType}","${businessSmallType}","${businessRequire}","${dianziRequire}","${way}","${lr_renyuan}","${dianziSchedule}",${customerId},NOW(),${tip})`;
  var mysql2 = `UPDATE customer SET c_mean = '待转移客户',ifcome = '1' WHERE customerId = ${customerId}`;
  var log_sql = `INSERT INTO kefu_log (c_name,kefu_name,add_time,do_what,customerId) values
    ("${customerName}","${lr_renyuan}",NOW(),"${lr_renyuan}给客户${customerName}生成了订单,业务大类:${businessBigType},业务小类:${businessSmallType}",${customerId})`;
  console.log("新增订单日志sql:" + log_sql);
  console.log("新增订单sql:" + mysql);
  let INSERTorder = new Promise((resolve, reject) => {
    query(mysql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    })

  })
  let UPDATEcustomer = new Promise((resolve, reject) => {
    query(mysql2, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    })

  })
  let INSERTlog = new Promise((resolve, reject) => {
    query(mysql2, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    })
  })
  Promise.all([INSERTorder, UPDATEcustomer, INSERTlog]).then((results) => {
    if (results[0] > 0 && results[1] > 0 && results[2] > 0) {
      const u_id = userID(req)
      let sql = `SELECT superior FROM user WHERE u_id = ${u_id}`
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        res.send({
          code: 20000,
          msg: '订单成功生成',
          superior: results[0].superior
        });
      })
    }
  })
}


