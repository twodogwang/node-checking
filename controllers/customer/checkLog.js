const query = require("../../module/sqlpool.js")
exports.checkLog = (req, res) => {
  const customerId = req.query.customerId;

  /* 
    查看客户日志
  */
  var mysql = `
    SELECT add_time,kefu_name,do_what FROM kefu_log WHERE customerId = ${customerId}  ORDER BY log_id DESC`;
  query(mysql, function (err, results, fields) {
    if (err) return console.log(err)
    if (results.length > 0) {
      res.send({ code: 20000, msg: "获取成功", data: { list: results } });
    } else {
      res.send({ code: 10000, msg: "该客户尚未填写日志" });
    }
  });
}

