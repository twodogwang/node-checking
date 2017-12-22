const query = require("../../module/sqlpool.js");
const GetUserInfo = require("../../module/getUserInfo.js").userInfo;

exports.highseasCustomer = function (req, res) {
  console.log("highseasCustomer")
  const UserInfo = GetUserInfo(req)
  const Level = UserInfo.permissionLevel
  const userID = Number(UserInfo.u_id)
  let pageSql = `SELECT c.customerId FROM customer c
  LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
  WHERE c.come_rate = 0 `
  /* 
    获取公海客户列表
  */
  let pagePromise = new Promise((resolve, reject) => {
    query(pageSql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.length)
    })
  })
  let SelectSql = `SELECT
  c.customerId,
  c.ifcome,
  c.c_name,
  c.c_mean,
  u.u_username,
  date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
  c.who,
  c.done,
  c.kf_tel,
  c.kf_tel_bz,
  c.c_bz,
  c.done_time,
  oo.proType,
  oo.acceptData
  FROM customer c
  LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
  LEFT JOIN user u ON u.u_id = c.lr_renyuan
  WHERE c.come_rate = 0
  ORDER BY c.customerId DESC `

  pagePromise.then(result => {
    let curPage = req.query.pageNum
    let pageSize = req.query.pageSize
    if (result === 0) {
      return res.send({
        'code': 10000,
        'msg': "公海客户为空",
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
    SelectSql += sqltatil
    console.log(SelectSql)
    query(SelectSql, (err, results, fields) => {
      if (err) return console.error(err)
      res.send({
        code:20000,
        msg: "公海客户获取成功",
        data: {
          list: results,
          pageNum: Number(curPage),
          pageSize: Number(pageSize),
          totalItems: Number(result)
        }
      })
    })
  })
}
// router.get("/customer/intentionCustomer",(req,res)=>{})
