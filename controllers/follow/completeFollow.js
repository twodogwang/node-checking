const query = require("../../module/sqlpool.js");
const now = require("../time");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.completeFollow = (req, res) => {
  const id = req.query.id;
  const userInfo = getUserInfo(req)
  /* 
    完成待跟进，改变跟进状态
  */
  const u_id = userInfo.u_id
  const mysql = `UPDATE todolist SET ifdone = '1' WHERE id = ${id} AND u_username = ${u_id}`;
  console.log("完成待办事项sql:" + mysql);
  query(mysql, function (err, results, fields) {
    if (err) return console.log(err);
    res.send({ "code": 20000, "msg": "已完成" })
  })
}
