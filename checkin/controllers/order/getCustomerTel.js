const query = require("../../module/sqlpool.js");
const GetUserInfo = require("../../module/getUserInfo.js").userInfo

exports.getCustomerTel = (req,res)=>{
  let sql = `SELECT c_tel FROM customer WHERE customerId = ${req.query.customerId}`
  query(sql,(err,results,fields)=>{
    if(err) return console.error(err)
    if(results.length == 0){
      res.send({
        code:100,
        msg:"获取失败"
      })
    }else{
      res.send({
        code:20000,
        msg:"获取成功",
        data:results[0].c_tel
      })
    }
  })
}
