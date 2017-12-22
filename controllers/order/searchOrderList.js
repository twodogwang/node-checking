const query = require("../../module/sqlpool.js");
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetUsername = require("../../module/getUserInfo.js").username

exports.searchOrderList = (req, res) => {
  const Level = GetpermissionLevel(req)
  const userID = GetuserID(req)
  const username = GetUsername(req)
  /* 
    查询订单参数serchinput, serchBigtype（业务大类）, serchSmalltype（业务小类）, Level1,（权限等级） startDate（开始时间）, endDate（结束时间）
    这次写的比客户搜索简单了，但是运行起来会比较慢因为有五个判断，客户那只有一个
    就是每个都判断一下是否存在，存在就用AND 链接起来 不存在 就用空字符串
    这个和已放款是分开来的，但是逻辑意义，已放款那我就不写了
  */
  console.log("searchOrderList", username, userID, Level)
  const serchinput1 = req.body.searchString;
  const serchBigtype1 = req.body.searchBigType || "";
  const serchSmalltype1 = req.body.searchSmallType || "";
  const startDate1 = req.body.startDate || "";
  const endDate1 = req.body.endDate || "";
  if (Level == 7) {
    var per_sqlstr = ` AND o.fk_Id = ${userID} `;
    var tail_sql = ` ,o.customerTel `
  } else if (Level == 6) {
    var per_sqlstr = ` AND o.MangerId = ${userID} `;
    var tail_sql = ``
  } else if (Level == 1) {
    var per_sqlstr = "";
    var tail_sql = ` ,o.customerTel `
  } else if (Level == 2 || Level == 5) {
    var per_sqlstr = "";
    var tail_sql = ``
  }
  function pageSqlFN(serchinput, serchBigtype, serchSmalltype, Level1, startDate, endDate) {
    var mysql = `
SELECT
o.id${tail_sql}
FROM orderYuegui o WHERE`
    if (serchinput && serchinput != "") {
      var sql1 = ` (o.customerId = (SELECT customerId FROM customer WHERE c_name = "${serchinput}") OR o.fk_id = (SELECT u_id FROM user WHERE u_username = "${serchinput}")
      OR (o.customerId in (SELECT customerId FROM customer WHERE lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${serchinput}")))) `
      mysql += sql1
    } else {
      var sql1 = ""
      mysql += sql1
    }
    if (serchBigtype && serchBigtype != "") {
      var sql2 = ` o.businessBigType ="${serchBigtype}" `
      if (sql1 == "") {
        mysql += sql2
      } else {
        mysql += "AND" + sql2
      }
    } else {
      var sql2 = ""
      mysql += sql2
    }
    if (serchSmalltype && serchSmalltype != "") {
      var sql3 = ` o.businessSmallType ="${serchSmalltype}" `
      if (sql2 == "" && sql1 == "") {
        mysql += sql3
      } else {
        mysql += "AND" + sql3
      }
    } else {
      var sql3 = ""
      mysql += sql3
    }
    if (startDate && startDate != "" && endDate && endDate != "") {
      var sql4 = ` o.acceptData >= "${startDate}" AND o.acceptData < "${endDate}" `
      if (sql2 == "" && sql1 == "" &&sql3 == "") {
        mysql += sql4
      } else {
        mysql += "AND" + sql4
      }
    } else if (startDate && startDate != "") {
      var sql4 = ` o.acceptData LIKE "%${startDate}%" `
      if (sql2 == "" && sql1 == "" &&sql3 == "" &&sql3 == "") {
        mysql += sql4
      } else {
        mysql += "AND" + sql4
      }
    } else {
      var sql4 = ""
      mysql += sql4
    }
    mysql += per_sqlstr
    console.log("分页sql:" + mysql);
    return mysql;
  }

  function sqlstring(serchinput, serchBigtype, serchSmalltype, Level1, startDate, endDate) {
    var mysql = `
SELECT
o.id,o.proNum,o.customerName,o.businessBigType,o.businessSmallType,o.businessRequire,o.dianziRequire,o.way,o.lr_renyuan,
u.u_username as fk_name,o.proType,o.proSchedule,o.dianziSchedule,o.acceptData,o.lastUpdate,o.customerId,proNewdata${tail_sql}
FROM orderYuegui o
LEFT JOIN user u ON u.u_id = o.fk_id WHERE `
    if (serchinput && serchinput != "") {
      var sql1 = ` (o.customerId = (SELECT customerId FROM customer WHERE c_name = "${serchinput}") OR o.fk_id = (SELECT u_id FROM user WHERE u_username = "${serchinput}")
      OR (o.customerId in (SELECT customerId FROM customer WHERE lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${serchinput}"))))  `
      mysql += sql1
    } else {
      var sql1 = ""
      mysql += sql1
    }
    if (serchBigtype && serchBigtype != "") {
      var sql2 = ` o.businessBigType ="${serchBigtype}" `
      if (sql1 == "") {
        mysql += sql2
      } else {
        mysql += "AND" + sql2
      }
    } else {
      var sql2 = ""
      mysql += sql2
    }
    if (serchSmalltype && serchSmalltype != "") {
      var sql3 = ` o.businessSmallType ="${serchSmalltype}" `
      if (sql1 == "" && sql2 == "") {
        mysql += sql3
      } else {
        mysql += "AND" + sql3
      }
    } else {
      var sql3 = ""
      mysql += sql3
    }
    if (startDate && startDate != "" && endDate1 && endDate != "") {
      var sql4 = ` o.acceptData >= "${startDate}" AND o.acceptData < "${endDate}" `
      if (sql1 == "" && sql2 == "" &&sql3 == "") {
        mysql += sql4
      } else {
        mysql += "AND" + sql4
      }
    } else if (startDate && startDate != "") {
      var sql4 = ` o.acceptData LIKE "%${startDate}%" `
      if (sql1 == "" && sql2 == "" && sql3 == "") {
        mysql += sql4
      } else {
        mysql += "AND" + sql4
      }
    } else {
      var sql4 = ""
      mysql += sql4
    }
    mysql += per_sqlstr
    console.log("搜索订单sql:" + mysql);
    return mysql;
  }

  var mysql = sqlstring(serchinput1, serchBigtype1, serchSmalltype1, Level, startDate1, endDate1);
  var pageSql = pageSqlFN(serchinput1, serchBigtype1, serchSmalltype1, Level, startDate1, endDate1);
  let pagePromise = new Promise((resolve, reject) => {
    query(pageSql, (err, results, fields) => {
      if (err) return console.error(err)
      resolve(results.length)
    })
  })
  pagePromise.then((result) => {
    let curPage = req.body.pageNum
    let pageSize = req.body.pageSize
    if (result === 0) {
      return res.send({
        'code': 20000,
        'msg': "搜索结果为空",
        'data': {
          list: [],
          pageNum: Number(curPage),
          pageSize: Number(pageSize),
          totalItems: Number(result)
        }
      })
    } else {
      query(mysql, function (err, results, fields) {
        if (err) return console.log(err);
        res.send({
          code: 20000,
          msg: "搜索成功",
          data: {
            list: results,
            pageNum: Number(curPage),
            pageSize: Number(pageSize),
            totalItems: Number(result)
          }
        })
      });
    }
  })
}
