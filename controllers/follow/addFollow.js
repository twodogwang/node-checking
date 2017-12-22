const query = require("../../module/sqlpool.js");
const now = require("../time");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;


exports.addFollow = function (req, res) {
  const userInfo = getUserInfo(req)
  const todo_data = req.body.date;
  const u_username = userInfo.u_username
  const u_id = userInfo.u_id
  const todo_content = req.body.follow;
  const customerId = req.body.customerId;
  const c_name = req.body.c_name;
  const done = "已完成";
  /* 
    添加跟进，功能类似于备忘录
    跟进内容插入数据库的同时还要插入日志
  */
  const mysql = `INSERT INTO todolist (todo_data,u_username,todo_content,customerId) values ("${todo_data}",${u_id},"${todo_content}",${customerId})`;
  const mysql2 = `UPDATE customer SET c_bz = CONCAT(c_bz,"\n${todo_data}:${todo_content}") WHERE customerId = ${customerId}`;
  const mysql3 = ` INSERT INTO kefu_log (c_name,kefu_name,add_time,do_what,done,customerId) values ("${c_name}","${u_username}",NOW(),"新增跟进:${todo_data}${todo_content}","${done}",${customerId}) `;
  console.log("新增跟进sql:" + mysql);
  console.log("新增跟进后修改备注sql:" + mysql2);
  console.log("新增跟进日志sql:" + mysql3)
  let INSERTtodolist = new Promise((resolve, reject) => {
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
    query(mysql3, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.affectedRows)
    })
  })

  Promise.all([INSERTtodolist, UPDATEcustomer, INSERTlog]).then((results) => {
    if (results[0] > 0 && results[1] > 0 && results[2] > 0) {
      let sql = `SELECT superior FROM user WHERE u_id = ${u_id}`
      query(sql, (err, results, fields) => {
        if (err) return console.error(err)
        res.send({
          code: 20000,
          msg: '添加成功',
          superior: results[0].superior
        });
      })
    } else {
      res.send({ code: 10000, msg: "添加失败" });
    }
  })
}
