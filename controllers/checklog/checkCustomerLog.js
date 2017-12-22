const query = require("../../module/sqlpool.js");
const GetUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.checkCustomerLog = function (req, res) {
  let userInfo = GetUserInfo(req)
  let Level = userInfo.permissionLevel
  /* 
    查看日志，超级管理员和监督专员查看所有
    其他人自己查看自己的
    只有超级管理员和监督和风控经理和营销经理能看
  */
  if (Level == 3 || Level == 1 || Level == 2 || Level == 6) {
    if (Level == 6 || Level == 3) {
      var sqlstr = `select log_fkzg_id from log_fkzg where whoWrite = "${userInfo.u_username}" `;
    } else {
      var sqlstr = `select log_fkzg_id from log_fkzg`;
    }
  }
  let pageSql = new Promise((resolve, reject) => {
    query(sqlstr, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.length)
    })
  })
  pageSql.then(result => {
    let curPage = req.query.pageNum
    let pageSize = req.query.pageSize
    if (result === 0) {
      return res.send({
        'code': 20000,
        'msg': "日志为空",
        'data': {
          list: [],
          pageNum: Number(curPage),
          pageSize: Number(pageSize),
          totalItems: Number(result)
        }
      })
    }
    if (result < pageSize) {
      var sqltatil = ` LIMIT ${result * (curPage - 1)},${result}`
    } else {
      var sqltatil = ` LIMIT ${pageSize * (curPage - 1)},${pageSize}`
    }
    if (Level == 3 || Level == 6) {
      var fkzg_log_sql = `select to_who,log_bz,time from log_fkzg  where whoWrite = "${userInfo.u_username}"
      ORDER BY log_fkzg_id DESC `;
    } else {
      var fkzg_log_sql = `select to_who,log_bz,time from log_fkzg ORDER BY log_fkzg_id DESC
       `;
    }
    fkzg_log_sql += sqltatil
    query(fkzg_log_sql, function (err, results, fields) {
      if(err) return console.log(err)
      res.send({
        code:20000,
        msg:"获取成功",
        data:{
          list:results,
          pageNum: Number(curPage),
          pageSize: Number(pageSize),
          totalItems: Number(result)
        }
      })
    })
  })
}
