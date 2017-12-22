

const query = require("../../module/sqlpool.js");
const log = require("../log").log;
const log1 = require("../log").log1;
const now = require("../time");
const userID = require("../../module/getUserInfo.js").username;
const getid = require("../../module/getUserInfo.js").userId;
exports.changeInfo = function (req, res) {
  const u_id = getid(req)
  /* 
    更改个人信息，
    此处坑多，甚改，，如：
    客户是否做过贷款，贷款机构有一个单独的表，要先删后增，
    客户是否有保单，也有一个单独的表，也要先删后增
  */


  var c_hj = req.body.c_hj,
    c_name = req.body.c_name || "",
    c_number = req.body.c_number || "",
    c_tel = req.body.c_tel,
    c_mean = req.body.c_mean,
    c_age = req.body.c_age || 0,
    c_hyqk = req.body.c_hyqk,
    c_zxqk = req.body.c_zxqk,
    c_zxcxcs = req.body.c_zxcxcs,
    c_wld = req.body.c_wld,
    c_sfzgdk = req.body.c_sfzgdk,
    c_sftx = req.body.c_sftx,
    c_ywdqyq = req.body.c_ywdqyq,
    c_ed = req.body.c_ed || 0,
    c_xl = req.body.c_xl,
    c_sybx = req.body.c_sybx,
    c_fs = req.body.c_fs || 0,
    c_bxgs = req.body.c_bxgs || "",
    c_sxsj = req.body.c_sxsj || 0,
    c_zje = req.body.c_zje || 0,
    c_bz = req.body.c_bz || "",
    c_bdzx = req.body.c_bdzx || 0,
    sfzgdk_fkjg = req.body.sfzgdk_fkjg || "",
    c_jfcs = req.body.c_jfcs || 0,
    c_yqcs = req.body.c_yqcs || 4,
    c_dj_day = req.body.c_dj_day || 0,
    wl_zed = req.body.wl_zed || 0,
    wl_ysyed = req.body.wl_ysyed || 0,
    tx_fk_time = req.body.tx_fk_time || 0,
    c_ywdj = req.body.c_ywdj || 0,
    c_yqed = req.body.c_yqed || 0,
    c_ifbh = req.body.c_ifbh || 0,
    change_sql = `
        UPDATE customer SET
        c_hj= "${c_hj}",
        c_name = "${c_name}",
        c_number = "${c_number}",
        c_mean = "${c_mean}",
        c_tel = "${c_tel}",
        c_age= ${c_age},
        c_hyqk= "${c_hyqk}",
        c_zxqk= "${c_zxqk}",
        c_zxcxcs= ${c_zxcxcs},
        c_wld = ${c_wld},
        c_sfzgdk= ${c_sfzgdk},
        sfzgdk_fkjg = "${sfzgdk_fkjg}",
        c_sftx= ${c_sftx},
        c_ywdqyq= ${c_ywdqyq},
        c_ed= ${c_ed},
        c_xl= ${c_xl},
        c_sybx= ${c_sybx},
        c_fs= ${c_fs},
        c_bxgs= "${c_bxgs}",
        c_sxsj= ${c_sxsj},
        c_zje= ${c_zje},
        c_bz= "${c_bz}",
        c_bdzx = ${c_bdzx},
        c_jfcs = ${c_jfcs},
        c_yqcs = ${c_yqcs},
        c_dj_day = ${c_dj_day},
        wl_zed = ${wl_zed},
        wl_ysyed =${wl_ysyed},
        tx_fk_time = ${tx_fk_time},
        c_ywdj = ${c_ywdj},
        c_yqed = ${c_yqed},
        c_ifbh = ${c_ifbh}
        WHERE
        c_tel = "${req.body.c_tel}" AND c_mean = "意向客户"`;
  var time = now.format("yyyy年MM月dd日 hh:mm:ss");
  query(change_sql, function (err, results, fields) {
    try {
      log("修改个人信息sql:" + change_sql);
      if(results.affectedRows == 0){
        return res.send({
          code: 10000,
          msg: '修改失败,不能修改待转移或已转移客户',
        });
      }
      query(`SELECT customerId FROM  customer WHERE c_tel = "${req.body.c_tel}"`, function (err, results, fields) {
        //查客户id  ,,然后改 放款机构 和保险公司
        try {
          var _customerId = results[0].customerId;
          var kehuLogSql = `
                        INSERT INTO kefu_log (c_name,kefu_name,add_time,do_what,c_number,customerId,c_tel)
                        values
                        ("${req.body.c_name}","${userID(req)}",NOW(),"${time},${userID(req)}更新了客户${req.body.c_name}的个人信息\n备注:${c_bz}","${req.body.c_number}",${_customerId},"${req.body.c_tel}")`
          query(kehuLogSql, function (err, results, fields) { });
          query(`DELETE FROM  cus_jigou WHERE customerId = ${_customerId}`, function (err, results, fields) {
            //先删后增
            try {
              if (req.body.c_sybx && req.body.c_sybx == 1 && req.body.c_bxgs.length > 1) {
                //保险公司 id
                var jigou_sql = ` INSERT INTO cus_jigou (customerId,bxgs_id) VALUES ( `;
                for (var i = 0; i < req.body.c_bxgs.length; i++) {
                  if (i == req.body.c_bxgs.length - 1) {
                    jigou_sql += ` ${_customerId} , ${req.body.c_bxgs[i]} )`;
                  } else {
                    jigou_sql += ` ${_customerId} , ${req
                      .body.c_bxgs[i]} ),( `;
                  }
                }
                insertJigou(jigou_sql);
              } else if (req.body.c_sybx && req.body.c_sybx == 1 && req.body.c_bxgs.length == 1) {
                var jigou_sql = ` INSERT INTO cus_jigou (customerId,bxgs_id) VALUES ( ${_customerId} , ${req.body.c_bxgs} )`;
                insertJigou(jigou_sql);
              }
              if (req.body.c_sfzgdk && req.body.c_sfzgdk == 1 && req.body.sfzgdk_fkjg.length > 1) {
                var jigou_sql = ` INSERT INTO cus_jigou (customerId,fkjg_id) VALUES ( `;
                for (var i = 0; i < req.body.sfzgdk_fkjg.length; i++) {
                  if (i == req.body.sfzgdk_fkjg.length - 1) {
                    jigou_sql += ` ${_customerId} , ${req.body.sfzgdk_fkjg[i]}  )`;
                  } else {
                    jigou_sql += ` ${_customerId} , ${req.body.sfzgdk_fkjg[i]}  ),( `;
                  }
                }
                insertJigou(jigou_sql);
              } else if (req.body.c_sfzgdk && req.body.c_sfzgdk == 1 && req.body.sfzgdk_fkjg.length == 1) {
                var jigou_sql = ` INSERT INTO cus_jigou (customerId,fkjg_id) VALUES ( ${_customerId} , ${req.body.sfzgdk_fkjg} )`;
                insertJigou(jigou_sql);
              }
            } catch (err) {
              log1(err);
            }
          }
          );
          let sql = `SELECT superior FROM user WHERE u_id = ${u_id}`
          query(sql, (err, results, fields) => {
            if (err) return console.error(err)
            res.send({
              code: 20000,
              msg: '修改成功',
              superior:results[0].superior
            });
          })
        } catch (err) {
          log1(err);
        }
      }
      );
    } catch (err) {
      log1(err);
    }
  });
  var insertJigou = function (insertsql) {
    //插入的封装
    log(insertsql);
    try {
      query(insertsql, function (err, results, fields) {
        try {
          console.info(results);
        } catch (err) {
          log1(err);
        }
      });
    } catch (err) {
      log1(err.error_msg);
    }
  };
}
// router.post("/customer/changeInfo", function(req, res) {});
