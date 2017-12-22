const query = require("../../module/sqlpool.js");
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetUsername = require("../../module/getUserInfo.js").username

exports.searchPayforOrderList = (req, res) => {
    const Level = GetpermissionLevel(req)
    const userID = GetuserID(req)
    const username = GetUsername(req)
    /* 
        搜索已放款订单
    */
    console.log("searchPayforOrderList", username, userID, Level)
    const serchinput1 = req.body.searchString;
    const serchBigtype1 = req.body.searchBigType || "";
    const serchSmalltype1 = req.body.searchSmallType || "";
    const startDate1 = req.body.startDate || "";
    const endDate1 = req.body.endDate || "";
    if (Level == 7) {
        var per_sqlstr = ` AND o.fk_id = ${userID} `;
    } else if (Level == 6) {
        var per_sqlstr = ` AND o.MangerId = ${userID} `;
    } else if (Level == 1) {
        var per_sqlstr = "";
        var tail_sql = ` ,o.customerTel `
    } else if (Level == 2 || Level == 5) {
        var per_sqlstr = "";
    }

    function pageSqlFN(serchinput, serchBigtype, serchSmalltype, Level1, startDate, endDate) {
        var mysql = `
SELECT
p.payfor_id
FROM payfororder p
LEFT JOIN orderyuegui o ON p.customerId = o.customerId AND p.fk_id = o.fk_id
WHERE `
        if (serchinput && serchinput != "") {
            var sql1 = ` (p.customerId = (SELECT customerId FROM customer WHERE c_name = "${serchinput}") OR p.fk_id = (SELECT u_id FROM user WHERE u_username = "${serchinput}")
      OR p.customerId IN (SELECT customerId FROM customer WHERE lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${serchinput}"))) `
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
        if (startDate && startDate != "" && endDate && endDate != "") {
            var sql4 = ` p.pay_date >= "${startDate}" AND p.pay_date < "${endDate}" `
            if (sql1 == "" && sql2 == "" && sql3 == "") {
                mysql += sql4
            } else {
                mysql += "AND" + sql4
            }
        } else if (startDate && startDate != "") {
            var sql4 = ` p.pay_date LIKE "%${startDate}%" `
            if (sql1 == "" && sql2 == "" && sql3 == "") {
                mysql += sql4
            } else {
                mysql += "AND" + sql4
            }
        } else {
            var sql4 = ""
            mysql += sql4
        }
        console.log("分页sql:" + mysql);
        return mysql;
    }

    function sqlstring(serchinput, serchBigtype, serchSmalltype, Level1, startDate, endDate) {
        var mysql = `
SELECT DISTINCT
o.id,
o.customerName,
o.businessBigType,
o.customerId,
o.businessSmallType,
o.businessRequire,
o.tip,
o.lr_renyuan,
u.u_username as fk_name,
o.acceptData,
o.proNewdata,
p.payforChannel,
p.paybackWay,
p.payforMoney,
p.limitDate,
p.paybackPoint,
p.contractNum,
p.payfor_id,
p.pay_date,
p.lookBZ,
p.lookSure,
p.sellBZ,
p.sellSure,
p.caiwuBZ,
p.caiwuSure,
p.dabaoBZ,
p.dabaoSure
FROM
payfororder p
LEFT JOIN orderyuegui o ON p.customerId = o.customerId AND p.fk_id = o.fk_id
LEFT JOIN user u ON u.u_id = p.fk_id WHERE `
        if (serchinput && serchinput != "") {
            var sql1 = ` (o.customerId = (SELECT customerId FROM customer WHERE c_name = "${serchinput}") OR o.fk_id = (SELECT u_id FROM user WHERE u_username = "${serchinput}")
  OR o.customerId IN (SELECT customerId FROM customer WHERE lr_renyuan = (SELECT u_id FROM user WHERE u_username = "${serchinput}")))  `
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
            if (sql2 == "") {
                mysql += sql3
            } else {
                mysql += "AND" + sql3
            }
        } else {
            var sql3 = ""
            mysql += sql3
        }
        if (startDate && startDate != "" && endDate && endDate != "") {
            var sql4 = ` p.pay_date >= "${startDate}" AND p.pay_date < "${endDate}" `
            if (sql3 == "") {
                mysql += "AND" + sql4
            } else {
                mysql += "AND" + sql4
            }
        } else if (startDate && startDate != "") {
            var sql4 = ` p.pay_date LIKE "%${startDate}%" `
            if (sql3 == "") {
                mysql += "AND" + sql4
            } else {
                mysql += "AND" + sql4
            }
        } else {
            var sql4 = ""
            mysql += sql4
        }
        console.log("搜索订单sql:" + mysql);
        return mysql;
    }

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
            var mysql = sqlstring(serchinput1, serchBigtype1, serchSmalltype1, Level, startDate1, endDate1);
            if (result < pageSize) {
                var sqltatil = ` LIMIT ${result * (curPage - 1)},${result}`
            } else {
                var sqltatil = ` LIMIT ${pageSize * (curPage - 1)},${pageSize}`
            }
            mysql += ` ORDER BY o.customerId DESC `
            mysql += sqltatil
            query(mysql, function(err, results, fields) {
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