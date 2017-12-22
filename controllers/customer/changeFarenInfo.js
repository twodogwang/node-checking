
const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const now = require("../time");
const userID = require("../../module/getUserInfo.js").username;
const getid = require("../../module/getUserInfo.js").userId;
exports.changeFarenInfo = function (req, res) {
  const u_id = getid(req)

  /* 
    更改法人信息
  */

  var f_zcsj = req.body.f_zcsj || "",
    w_yyzz = req.body.w_yyzz,
    f_dgls = req.body.f_dgls,
    f_ssrz = req.body.f_ssrz || 0,
    f_bsrz = req.body.f_bsrz || 0,
    f_dsls = req.body.f_dsls || 0,
    f_zls = req.body.f_zls || 0,
    f_zczj = req.body.f_zczj || 0,
    change_sql = `
        UPDATE customer SET
        f_zcsj="${req.body.f_zcsj}",
        w_yyzz=${req.body.w_yyzz},
        f_dgls=${req.body.f_dgls},
        f_ssrz=${f_ssrz},
        f_bsrz=${f_bsrz},
        f_dsls=${f_dsls},
        f_zls=${f_zls},
        f_zczj = ${f_zczj}
        WHERE
        c_tel = "${req.body.c_tel}" AND c_mean = "意向客户"`;
  var time = now.format("yyyy年MM月dd日 hh:mm:ss");
  var mysql = `SELECT customerId FROM customer WHERE c_tel = "${req.body.c_tel}"`;

  query(change_sql, function (err, results, fields) {
    try {
      log("修改法人信息sql:" + change_sql);
      if (results.affectedRows == 0) {
        return res.send({
          code: 10000,
          msg: '修改失败,不能修改待转移或已转移客户',
        });
      }
      query(mysql, function (err, results, fields) {
        try {
          var _customerId = results[0].customerId;
          query(`INSERT INTO kefu_log (c_name,kefu_name,add_time,do_what,c_number,customerId,c_tel) values
                    ("${req.body.c_name}","${userID(req)}",NOW(),"${time},${userID(req)}更新了客户${req.body.c_name}的法人信息","${req.body.c_number}",${_customerId},"${req.body.c_tel}")`, function (err, results, fields) { });
        } catch (err) {
          log1(err);
        }
      });
      let sql = `SELECT superior FROM user WHERE u_id = ${u_id}`
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        res.send({
          code: 20000,
          msg: '修改成功',
          superior: results[0].superior
        });
      })
    } catch (err) {
      log1(err);
    }
  });
}
// router.post("/customer/changeFarenInfo", function(req, res) {   });
