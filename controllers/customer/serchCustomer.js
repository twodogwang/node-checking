const query = require("../../module/sqlpool.js");
const GetuserID = require("../../module/getUserInfo.js").userId;
const GetpermissionLevel = require("../../module/getUserInfo.js").permissionLevel;
const GetUsername = require("../../module/getUserInfo.js").username;
exports.serch = function (req, res) {
  const Level = GetpermissionLevel(req)
  const userID = GetuserID(req)
  const u_username = GetUsername(req)
  if (Level === 4) {
    var chasql = `SELECT * FROM  customer WHERE c_tel = "${req.query.c_tel}" AND lr_renyuan = ${userID} OR kf_tel = "${u_username}" order by customerId desc`
  } else if (Level === 1) {
    var chasql = `SELECT * FROM  customer WHERE c_tel = "${req.query.c_tel}" order by customerId desc`
  }
  console.log(chasql)
  query(chasql, function (err, results, fields) {
    try {
      if (results.length >= 1) {
        var obj = {};
        obj.code = 20000;
        for (var key in results[0]) {
          obj[key] = results[0][key];
        }
        obj.msg = "搜索成功"
        res.send(obj);

      } else if (results.length == 0) {
        res.send({ code: 10000, msg: "没有该客户或者不是你的客户" })
      }else{
        res.send({ code: 10000, msg: "数据出错请联系管理员删除" })
      }
    } catch (err) {
      console.log(err);
    }
  });
}
// router.get("/customer/serch",(req,res)=>{})
