const query = require("../../module/sqlpool.js");
const getUserInfo = require("../../module/getUserInfo.js").userInfo;
exports.getTodoFollow = (req, res) => {
  console.log("getTodoFollow")
  const userInfo = getUserInfo(req)
  const Level = userInfo.permissionLevel
  if (Level == 4) {
    const u_username = userInfo.u_username
    const u_id = userInfo.u_id
    /* 
      获取所有待跟进
      限制。。。你懂得
    */
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_tel,c.c_bz
      FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE
      o.customerId = c.customerId AND o.u_username = ${u_id} AND ifdone = '0'`;
  } else if (Level == 1) {
    var mysql2 = `SELECT o.*,c.c_name,u.u_username,c.c_tel,c.c_bz FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE o.customerId = c.customerId AND o.ifdone = '0'`;
  }else if(Level == 3){
    const u_id = userInfo.u_id
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_bz
      FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE
      o.customerId = c.customerId AND o.ifdone = '0'
      AND o.u_username IN (SELECT u_id FROM user WHERE superior = ${u_id})`;
  }else if( Level == 2){
    var mysql2 = `SELECT
      o.id,o.todo_data,o.ifdone,o.todo_content,
      o.customerId,c.c_name,u.u_username,c.c_bz
      FROM todolist o

      LEFT JOIN user u
      ON o.u_username = u.u_id
      LEFT JOIN customer c
      ON o.customerId = c.customerId
      WHERE
      o.customerId = c.customerId AND o.ifdone = '0'`;
  }
  console.log(mysql2);
  query(mysql2, function (err, results, fields) {
    if (err) return console.log(err);
    var todolist = results;
    if(todolist.length ==0){
      res.send( {
        code:20000,
        msg:"没有待办事项",
        todolist: []
      });
    }else{
      res.send( {
        code:20000,
        msg:"获取成功",
        todolist: todolist
      });
    }
  });
}
