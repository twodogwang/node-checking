const query = require("../../module/sqlpool.js")

exports.checkLog = (req, res) => {
  const orderId = req.query.id;
  var mysql = `
    SELECT c_name,fk_name,meet_time,need_ed,if_sign,not_reason,case_number,case_file,tip,log_beizhu,addtime
    FROM log_fkzy WHERE orderId = ${orderId} ORDER BY log_fkzy_id DESC`;
  query(mysql, function (err, results, fields) {
    if (err) return console.log(err)
    if (results.length > 0) {
      res.send({ code: 20000, msg: "你看吧", data: { list: results } });
    } else {
      res.send({ code: 10000, msg: "该订单尚未填写日志" });
    }
  });
}

