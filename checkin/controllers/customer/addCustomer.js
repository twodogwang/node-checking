

const query = require("../../module/sqlpool.js");
/* const log = require("../log").log;
const log1 = require("../log").log1; */
const now = require("../time");
const GetUserName = require("../../module/getUserInfo.js").username;
const getid = require("../../module/getUserInfo.js").userId;
const getLevel = require("../../module/getUserInfo.js").permissionLevel;


exports.addCustomer = function (req, res) {
  const u_id = getid(req)
  var c_name = req.body.c_name || "",
    c_mean = req.body.c_mean,
    c_lx = req.body.c_lx,
    c_number = req.body.c_number || "",
    c_tel = req.body.c_tel,
    c_sex = req.body.c_sex,
    c_hj = req.body.c_hj,
    c_age = req.body.c_age || 0,
    c_bz = req.body.c_bz || "",
    lr_renyuan = GetUserName(req);
  var chasql = `SELECT c_tel FROM  customer WHERE c_tel="${req.body.c_tel}" `;
  let insertBefor = new Promise((resolve, reject) => {
    console.log(chasql)
    query(chasql, (err, results, fields) => {
      if (err) return console.error(err)
      if (results.length == 0) {
        let insert_sql = ` INSERT INTO customer (c_name,c_lx,c_number,c_tel,c_sex,c_hj,c_age,c_bz,lr_renyuan,c_mean,m_addtime) values ("${c_name}",${c_lx},"${c_number}","${c_tel}",${c_sex},"${c_hj}",${c_age},"${c_bz}",${u_id},"${c_mean}",NOW()) `;
        console.log(insert_sql)
        query(insert_sql, (err, results, fields) => {
          if (err) return console.error(err)
          resolve(results.affectedRows)
        })
      } else {
        resolve(0)
      }
    })
  })

  let getSuperior = new Promise((resolve, reject) => {
    const Level = getLevel(req)
    if (Level == 1) {
      resolve("admin")
    } else {
      let sql = `SELECT superior FROM user WHERE u_id = ${u_id}`
      console.log(sql)
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        resolve(results[0].superior)
      })
    }
  })

  Promise.all([insertBefor, getSuperior]).then((results) => {
    console.log(results[0])
    if (results[0] > 0 && results[1] != "admin") {
      res.send({
        code: 20000,
        msg: "添加成功",
        superior: results[1]
      })
    } else if (results[0] == '0') {
      res.send({
        code: 10000,
        msg: "该客户已存在"
      })
    }
  })



}
// router.post("/add/customer", function(req, res) { });
