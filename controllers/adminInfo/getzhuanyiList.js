

const query = require("../../module/sqlpool.js");
const getUserInfo = require("../../module/getUserInfo.js").userInfo

exports.getzhuanyiList = function (req, res) {
  console.log("getzhuanyiList")
  const info = getUserInfo(req);
  const Level = info.permissionLevel
  /* 
    获取可转移人员列表
    炒鸡管理员可获取 3 4 6 7 的人员
    3 获取 4
    6 获取 7
  */
  if(Level == 1){
    var sql = `SELECT u_id,u_username FROM user WHERE permissionLevel = 3 OR permissionLevel = 4 OR permissionLevel = 6 OR permissionLevel = 7 `
  }else if(Level == 3){
    var sql = `SELECT u_id,u_username FROM user WHERE permissionLevel = 4 `
  }else if(Level == 6){
    var sql = `SELECT u_id,u_username FROM user WHERE permissionLevel = 7 `
  }
  query(sql,(err,results,fields)=>{
    if(err) return console.error(err)
    if(results.length === 0){
      res.send({
        code:20000,
        msg:"无可转移人员"
      })
    }else{
      res.send({
        code:20000,
        msg:"获取成功",
        data:results
      })
    }
  })
}

