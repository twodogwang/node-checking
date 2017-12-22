const query = require("../../module/sqlpool.js");
const time = require("../time");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.getTodayTodoFollow = (req, res) => {
  const now = time.format("yyyy-MM-dd");
  const userInfo = getUserInfo(req)
  const Level = userInfo.permissionLevel
  const u_id = userInfo.u_id
  /* 
    获取今日待跟进 用 todo_data LIKE "%${now}%" 语句查询今日待跟进
    限制。。。。你懂得
  */
  if (Level == 4) {
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_tel,c.c_bz
      FROM todolist o
      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE o.customerId = c.customerId AND todo_data LIKE "%${now}%"  AND o.ifdone = 0 AND o.u_username = ${u_id} `;
  }else if(Level == 3){
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_tel,c.c_bz
      FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE o.customerId = c.customerId AND todo_data LIKE "%${now}%"  AND o.ifdone = 0
      AND o.u_username IN (SELECT u_id FROM user WHERE superior = ${u_id}) `;
  }else if(Level ==1){
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_bz,c.c_tel
      FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE o.customerId = c.customerId AND o.todo_data LIKE "%${now}%" AND o.ifdone = '0'`;
  } else if (Level ==2) {
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_bz
      FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE o.customerId = c.customerId AND o.todo_data LIKE "%${now}%" AND o.ifdone = '0'`;
  }
  console.log(mysql2)
  query(mysql2, function (err, results, fields) {
    if (err) return console.log(err);
    var todolist = results;
    if(todolist.length ==0){
      res.send({
        code:20000,
        msg:"没有今日待跟进",
        todolist: []
      });
    }else{
      res.send({
        code:20000,
        msg:"获取成功",
        todolist: todolist
      });
    }

  });
}
