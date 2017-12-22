const query = require("../../module/sqlpool.js");

exports.getPermissionList = function (req, res) {
  console.log("getPermissionList")
  const pageInfo = JSON.parse(req.query.pageInfo)
  let permissionBigType = pageInfo.big
  let permissionSmallType = pageInfo.small
  /* 
    按分类获取权限permissionBigType(大类)
                permissionSmallType(小类)
  */
  let sellecttotal = new Promise((resolve, reject) => {
    let total = `SELECT id FROM permission2 WHERE permissionSmallType = ${permissionSmallType} AND permissionBigType = ${permissionBigType}`
    query(total, (err, results, fields) => {
      if (err) console.error(err)
      resolve(results.length)
    })
  })
  sellecttotal.then((result) => {
    let curPage = pageInfo.pageNum
    let pageSize = pageInfo.pageSize
    if (result < pageSize) {
      var sql2 = `SELECT id,url,pDesc,permissionSmallType,permissionBigType FROM permission2 WHERE permissionSmallType = ${permissionSmallType} AND permissionBigType = ${permissionBigType} LIMIT ${result * (curPage - 1)},${result}`
    } else {
      var sql2 = `SELECT id,url,pDesc,permissionSmallType,permissionBigType FROM permission2 WHERE permissionSmallType = ${permissionSmallType} AND permissionBigType = ${permissionBigType} LIMIT ${pageSize * (curPage - 1)},${pageSize}`
    }
    console.log(sql2)
    query(sql2, (err, results, fields) => {
      if (err) console.error(err)
      res.send({
        'code': 20000,
        'msg': "获取成功",
        'data': {
          list: results,
          pageNum: Number(curPage),
          pageSize: pageSize,
          total: result
        }
      })
    })
  }).catch((err) => {
    return console.log(err)
  })
}
