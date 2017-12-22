const query = require("../../module/sqlpool.js");
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
exports.searchCustomerById = function (req, res) {
  const Level = GetpermissionLevel(req)
  const userID = GetuserID(req)
  
  /* 
    根据ID查询客户
  */
  if (Level == 3) {
    var chasql = `SELECT * FROM  customer WHERE customerId = ${req.query.customerId} AND lr_renyuan IN (SELECT u_id FROM user WHERE superior = ${userID})`
  } else if (Level == 1) {
    var chasql = `SELECT * FROM  customer WHERE customerId = ${req.query.customerId}`
  } else if (Level == 6) {
    var chasql = `SELECT * FROM  customer WHERE customerId = ${req.query.customerId} AND fkManager = ${userID}`
  } else if (Level == 7) {
    var chasql = `SELECT * FROM  customer WHERE customerId = ${req.query.customerId} AND fkManager = (SELECT superior FROM user WHERE u_id = ${userID})`
  }
  console.log(chasql)
  query(chasql, function (err, results, fields) {
    try {
      if (results.length == 1) {
        var obj = {};
        obj.code = 20000;
        for (var key in results[0]) {
          obj[key] = results[0][key];
        }
        delete obj.c_tel
        obj.msg = "搜索成功"
        res.send(obj);
      } else if (results.length == 0) {
        res.send({ code: 10000, msg: "没有该客户或者不是你的客户" })
      } else {
        res.send({ code: 10000, msg: "数据出错请联系管理员删除" })
      }
    } catch (err) {
      console.log(err);
    }
  });
}
