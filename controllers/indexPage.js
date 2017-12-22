const query = require("../module/sqlpool.js");
const GetUserInfo = require("../module/getUserInfo.js").userInfo
const time = require("./time");

/* 
  首页的信息展示
  GetcustomerType 获取客户类型的总数函数的封装
  GetTodo  获取进入代办事项总数
  GetproType 获取订单总数，按类型分类
  GetPayEDorder 获取已放款总数
*/
function GetcustomerType(sql, role_id) {
  return new Promise((resolve, reject) => {
    console.log(sql)
    query(sql, function (err, results, fields) {
      // var customerNum = [];
      let customer = []
      // customerNum.total = 0;
      for (let i = 0; i < results.length; i++) {
        /* if (results[i].c_mean == "意向客户") {
          customerNum.yixiang = results[i].num;
        } else if (results[i].c_mean == "已转移客户") {
          customerNum.alreadyForTransform = results[i].num;
        } else if (results[i].c_mean == "待转移客户") {
          customerNum.waitForTransform = results[i].num;
        } */
        // customerNum.total += results[i].num;
        customer[i] = {
          type: results[i].c_mean,
          num: results[i].num
        }

      }
      // resolve(customerNum)
      resolve(customer)
    })
  })
}

function GetTodo(sql, role_id) {
  return new Promise((resolve, reject) => {
    console.log(sql)
    query(sql, function (err, results, fields) {
      if (err) return console.log(err);
      var todayTodoList = results.length;
      resolve(todayTodoList)
    })
  })
}

function GetproType(sql, role_id) {
  return new Promise((resolve, reject) => {
    console.log(sql)
    query(sql, function (err, results, fields) {
      if (err) return console.log(err);
      // var customerNum = {};
      // customerNum.total = 0;
      let order = []
      if (role_id == 6 || role_id == 2 || role_id == 1) {
        for (let i = 0; i < results.length; i++) {
          order[i] = {
            type: results[i].proType,
            num: results[i].num
          }
        }
      } else if (role_id == 7) {
        for (let i = 0; i < results.length; i++) {
          order[i] = {
            type: results[i].proType,
            num: results[i].num
          }
        }
      }
      resolve(order)
    })
  })
}
function GetPayEDorder(sql, role_id) {
  console.log(sql)
  return new Promise((resolve, reject) => {
    query(sql, function (err, results, fields) {
      if (err) return console.log(err);
      resolve(results.length)
    })
  })
}


exports.indexPage = (req, res) => {
  const info = GetUserInfo(req)
  const Level = info.permissionLevel
  const now = time.format("yyyy-MM-dd");
  if (Level == 1 || Level == 2) {
    let mysql = `SELECT id,todo_content,todo_data,ifdone FROM todolist WHERE todo_data LIKE "%${now}%" AND ifdone = 0`;
    let mysql2 = `SELECT count(*) as num,c_mean FROM customer GROUP BY c_mean`;
    let mysql3 = `SELECT count(*) as num,proType FROM orderyuegui GROUP BY proType`;
    let mysql4 = `SELECT payfor_id FROM payfororder`;
    let customerType = GetcustomerType(mysql2, Level)
    let kefuTodo = GetTodo(mysql, Level)
    let orderType = GetproType(mysql3, Level)
    let payedOrder = GetPayEDorder(mysql4, Level)
    Promise.all([customerType, kefuTodo, orderType, payedOrder]).then(result => {
      res.send({
        code: 20000,
        todayTodoList: result[1],
        customerNum: result[0],
        orderNum: result[2],
        payedOrder: result[3]
      });
    }).catch(err => {
      return console.log(err)
    })
  } else if (Level == 3) {
    const u_id = info.u_id
    let mysql = `SELECT id,todo_content,todo_data,ifdone FROM todolist where todo_data LIKE "%${now}%" AND ifdone = 0 AND u_username IN (SELECT u_id FROM user WHERE superior = ${u_id})`;
    let mysql2 = `SELECT count(*) as num,c_mean FROM customer WHERE lr_renyuan IN (SELECT u_id FROM user WHERE superior = ${u_id}) GROUP BY c_mean `;
    let customerType = GetcustomerType(mysql2, Level)
    let kefuTodo = GetTodo(mysql, Level)
    Promise.all([kefuTodo, customerType]).then(result => {
      res.send({
        code: 20000,
        todayTodoList: result[0],
        customerNum: result[1],
      });
    }).catch(err => {
      return console.log(err)
    })
  } else if (Level == 4) {
    const u_id = info.u_id
    const u_username = info.u_username
    let mysql = `SELECT id,todo_content,todo_data,ifdone from todolist where u_username = ${u_id} and todo_data LIKE "%${now}%" and ifdone = 0`;
    let mysql2 = `SELECT count(*) as num,c_mean FROM customer WHERE lr_renyuan = ${u_id} OR kf_tel = "${u_username}" GROUP BY c_mean`;
    let customerType = GetcustomerType(mysql2, Level)
    let kefuTodo = GetTodo(mysql, Level)
    Promise.all([kefuTodo, customerType]).then(result => {
      res.send({
        code:20000,
        todayTodoList: result[0],
        customerNum: result[1]
      });
    }).catch(err => {
      return console.log(err)
    })
  }else if(Level == 6){
    const u_id = info.u_id
    const u_username = info.u_username
    let mysql3 = `SELECT count(*) as num,proType FROM orderyuegui WHERE MangerId = ${u_id} GROUP BY proType`;
    let mysql4 = `SELECT payfor_id FROM payfororder WHERE fk_id IN (SELECT u_id FROM user WHERE superior = ${u_id})`;
    let orderNum = GetproType(mysql3, Level)
    let payedOrder = GetPayEDorder(mysql4, Level)
    Promise.all([orderNum, payedOrder]).then(result => {
      res.send({
        code:20000,
        orderNum: result[0],
        payedOrder: result[1]
      });
    }).catch(err => {
      return console.log(err)
    })
  }else if(Level == 7){
    const u_id = info.u_id
    const u_username = info.u_username
    let mysql3 = `SELECT count(*) as num,proType FROM orderyuegui WHERE fk_id = ${u_id} GROUP BY proType`;
    let mysql4 = `SELECT payfor_id FROM payfororder WHERE fk_id = ${u_id}`;
    let orderNum = GetproType(mysql3, Level)
    let payedOrder = GetPayEDorder(mysql4, Level)
    Promise.all([orderNum, payedOrder]).then(result => {
      res.send({
        code:20000,
        orderNum: result[0],
        payedOrder: result[1]
      });
    }).catch(err => {
      return console.log(err)
    })
  }else if(Level == 5){
    let sql = `SELECT payfor_id FROM payfororder`
    query(sql,(err,results,fields)=>{
      if(err) return console.error(err)
      res.send({
        code:20000,
        payedOrder: results.length
      })
    })
  }
}
