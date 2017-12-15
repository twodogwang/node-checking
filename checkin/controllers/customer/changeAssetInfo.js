

const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const now = require("../time");
const userID = require("../../module/getUserInfo.js").username;
const getid = require("../../module/getUserInfo.js").userId;
exports.changeAssetInfo = function (req, res) {
  const u_id = getid(req)
  var m_fc = req.body.m_fc || 0,
    m_ywfcz = req.body.m_ywfcz || 0,
    m_fcdyjl = req.body.m_fcdyjl || 0,
    m_fcdz = req.body.m_fcdz || "",
    m_fclx = req.body.m_fclx || "",
    m_cqzt = req.body.m_cqzt || "",
    m_ajz = req.body.m_ajz || "",
    m_ajhk = req.body.m_ajhk || 0,
    m_hke = req.body.m_hke || 0,
    m_yhqs = req.body.m_yhqs || 0,
    m_cl = req.body.m_cl || 0,
    m_cp = req.body.m_cp || "",
    m_clzk = req.body.m_clzk || "",
    car_ajz = req.body.car_ajz,
    car_ajhk = req.body.car_ajhk || 0,
    car_hke = req.body.car_hke || 0,
    car_yhqs = req.body.car_yhqs || 0,
    c_ifsingle = req.body.c_ifsingle || 0,
    house_age = req.body.house_age || 0,
    change_sql = `
        UPDATE customer SET
        m_fc=${m_fc},
        m_ywfcz=${m_ywfcz},
        m_fcdyjl=${m_fcdyjl},
        m_fcdz="${m_fcdz}",
        m_fclx="${m_fclx}",
        m_cqzt="${m_cqzt}",
        m_ajz="${m_ajz}",
        m_ajhk=${m_ajhk},
        m_hke=${m_hke},
        m_yhqs=${m_yhqs},
        m_cl=${m_cl},
        m_cp="${m_cp}",
        m_clzk="${m_clzk}",
        car_ajz="${car_ajz}",
        car_ajhk=${car_ajhk},
        car_hke=${car_hke},
        car_yhqs=${car_yhqs},
        c_ifsingle=${c_ifsingle},
        house_age=${house_age}
        WHERE
        c_tel = "${req.body.c_tel}"`;
  var time = now.format("yyyy年MM月dd日 hh:mm:ss");
  query(`SELECT customerId FROM  customer WHERE c_tel = "${req.body.c_tel}"`, function (err, results, fields) {
    try {
      var _customerId = results[0].customerId;
      query(`INSERT INTO kefu_log (c_name,kefu_name,add_time,do_what,c_number,customerId,c_tel) values
            ("${req.body.c_name}","${userID(req)}",NOW(),"${time},${userID(req)}更新了客户${req.body.c_name}的资产信息","${req.body.c_number}",${_customerId},"${req.body.c_tel}")`, function (err, results, fields) { });
    } catch (err) {
      log1(err);
    }
  });
  query(change_sql, function (err, results, fields) {
    try {
      log("修改资产sql:" + change_sql);
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
// router.post("/customer/changeAssetInfo", function(req, res) {    });
