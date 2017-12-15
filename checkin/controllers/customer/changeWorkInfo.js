

const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const now = require("../time");
const userID = require("../../module/getUserInfo.js").username;
const getid = require("../../module/getUserInfo.js").userId;
exports.changeWorkinfo = function (req, res) {
  const u_id = getid(req)
  var w_gslx = req.body.w_gslx,
    w_zyyw = req.body.w_zyyw || "",
    w_sb = req.body.w_sb || 0,
    w_sbyjn = req.body.w_sbyjn || 0,
    w_js = req.body.w_js || 0,
    w_gjj = req.body.w_gjj || 0,
    w_gjjyjn = req.body.w_gjjyjn || 0,
    w_grjnje = req.body.w_grjnje || 0,
    w_dkgz = req.body.w_dkgz || 0,
    w_dkgzqs = req.body.w_dkgzqs || 0,
    w_dkgzed = req.body.w_dkgzed || 0,
    w_dkgzzd = req.body.w_dkgzzd || 0,
    sb_ywdj = req.body.sb_ywdj || 0,
    sb_ywbg = req.body.sb_ywbg || 0,
    sb_bdw = req.body.sb_bdw || 0,
    gg_ywdj = req.body.gg_ywdj || 0,
    gg_ywbg = req.body.gg_ywbg || 0,
    gg_sfb = req.body.gg_sfb || 0;
  change_sql = `
        UPDATE customer SET
        w_gslx="${w_gslx}",
        w_zyyw="${w_zyyw}",
        w_sb =${w_sb},
        w_sbyjn=${w_sbyjn},
        w_sbyjn=${w_sbyjn},
        w_js=${w_js},
        w_gjj=${w_gjj},
        w_gjjyjn=${w_gjjyjn},
        w_grjnje=${w_grjnje},
        w_dkgz=${w_dkgz},
        w_dkgzqs=${w_dkgzqs},
        w_dkgzed=${w_dkgzed},
        w_dkgzzd=${w_dkgzzd},
        sb_ywdj = ${sb_ywdj},
        sb_ywbg = ${sb_ywbg},
        sb_bdw = ${sb_bdw},
        gg_ywdj = ${gg_ywdj},
        gg_ywbg = ${gg_ywbg},
        gg_sfb = ${gg_sfb}
        WHERE
        c_tel = "${req.body.c_tel}"`;
  var time = now.format("yyyy年MM月dd日 hh:mm:ss");
  query(`SELECT customerId FROM  customer WHERE c_tel = "${req.body.c_tel}"`, function (err, results, fields) {
    try {
      var _customerId = results[0].customerId;
      var inserSql = `INSERT INTO kefu_log (c_name,kefu_name,add_time,do_what,c_number,customerId,c_tel) values
                ("${req.body.c_name}","${userID(req)}",NOW(),"${time},${userID(req)}更新了客户${req.body.c_name}的工作信息","${req.body.c_number}",${_customerId},"${req.body.c_tel}")`
      query(inserSql, function (err, results, fields) { });
    } catch (err) {
      log1(err);
    }
  }
  );
  query(change_sql, function (err, results, fields) {
    try {
      log("修改工作信息sql:" + change_sql);
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
// router.post("/customer/changeWorkinfo", function(req, res) {});

