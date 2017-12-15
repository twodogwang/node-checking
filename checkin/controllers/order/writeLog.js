
const query = require("../../module/sqlpool.js")
const GetUserInfo = require("../../module/getUserInfo.js").userInfo
const formidable = require("formidable")
const path = require('path');
const fs = require('fs');
exports.writeLog = (req, res) => {
  console.log("writeLogwriteLogwriteLog")
  const userInfo = GetUserInfo(req)
  const if_sign = req.body.if_sign
  if (if_sign == '0') {
    var c_name = req.body.c_name,
      fk_name = userInfo.u_username,
      meet_time = req.body.meet_time || " ",
      need_ed = req.body.need_ed || 0,
      not_reason = req.body.not_reason || "",
      case_number = req.body.case_number || "",
      tip = req.body.tip || 0,
      log_beizhu = req.body.log_beizhu || "",
      customerId = req.body.customerId,
      orderId = req.body.id;
    var sql = ` INSERT INTO log_fkzy (c_name,fk_name,meet_time,need_ed,if_sign,not_reason,case_number,tip,log_beizhu,customerId,orderId,addtime) values ("${c_name}","${fk_name}","${meet_time}",${need_ed},"${if_sign}","${not_reason}","${case_number}",${tip},"${log_beizhu}",${customerId},${orderId},NOW()) `;
    query(sql, function (err, results, fields) {
      try {
        if (results.affectedRows > 0) {
          var mysql = `UPDATE orderYuegui SET lastUpdate=NOW() WHERE id = ${orderId}`;
          console.log("最新更新时间sql:" + mysql);
          query(mysql, function (err, results, fields) {
            if (err) return console.log(err);
            if (results.affectedRows > 0) {
              res.send({
                code: 20000,
                msg: "填写成功",
                superior:userInfo.superior
              });
            }
          });
        } else {
          res.send({
            code: 10000,
            msg: "填写失败"
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    var form = new formidable.IncomingForm();
    /* form.keepExtensions = true;
    form.multiples = true; */
    form.uploadDir = __dirname + "../../../public/case_file1"; //文件上传地址
    console.log("__dirname", __dirname)
    form.parse(req, function (err, fields, files) {
      if (err) return console.log(err)
      var c_name = fields.c_name,
        fk_name = userInfo.u_username,
        meet_time = fields.meet_time || " ",
        need_ed = fields.need_ed || 0,
        not_reason = fields.not_reason || "",
        case_number = fields.case_number || "",
        tip = fields.tip || 0,
        log_beizhu = fields.log_beizhu || "",
        customerId = fields.customerId,
        file_if_sign = fields.if_sign,
        orderId = fields.id;
      //所有的文本域、单选框，都在fields存放；
      //所有的文件域，files
      if (files.case_file.size > 0) {
        var newpath = __dirname + "../../../public/case_file/" + case_number + ".jpg";
        var oldpath = path.normalize(files.case_file.path);
        fs.rename(oldpath, newpath, function (err) {
          if (err) {
            console.log("改名失败" + err);
          }
          var sql = ` INSERT INTO log_fkzy (c_name,fk_name,meet_time,need_ed,if_sign,not_reason,case_number,tip,log_beizhu,customerId,case_file,orderId,addtime) values ("${c_name}","${fk_name}","${meet_time}",${need_ed},"${file_if_sign}","${not_reason}","${case_number}",${tip},"${log_beizhu}",${customerId},"http://192.168.1.200:28888/case_file/${case_number}.jpg",${orderId},NOW()) `;
          console.log("新增日志sql:" + sql)
          query(sql, function (err, results, fields) {
            try {
              if (results.affectedRows > 0) {
                var mysql = `UPDATE orderYuegui SET lastUpdate=NOW() WHERE id = ${orderId}`;
                console.log("最新更新时间sql:" + mysql);
                query(mysql, function (err, results, fields) {
                  if (err) return console.log(err);
                  if (results.affectedRows > 0) {
                    res.send({
                      code: 20000,
                      msg: "填写成功",
                      superior:userInfo.superior
                    });
                  }
                });
              } else {
                res.send({
                  code: 10000,
                  msg: "填写失败"
                });
              }
            } catch (err) {
              console.log(err);
            }
          });
        });
      }
    });
  }
}
