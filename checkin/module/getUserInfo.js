const token = require("./token.js").token;

exports.userInfo = function (req) {
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return data.payload.data
}

exports.userId = function getUserId(req) {
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return data.payload.data.u_id
}

exports.permissionLevel = function (req) {
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return data.payload.data.permissionLevel
}

exports.username = function (req) {
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return data.payload.data.u_username
}

exports.superior = function (req) {
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return data.payload.data.superior
}

exports.role_id = function (req) {
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return data.payload.data.role_id
}

exports.getSuperior = function(req){
  var mytoken = req.header("X-Token")
  var data = token.decodeToken(mytoken);
  return new Promise((resolve,reject)=>{
    let sql = `SELECT superior FROM user WHERE u_id = ${data.payload.data.u_id}`
    query(sql,(err,results,fields)=>{
      if(err) return console.error(err)
      resolve(results[0].superior)
    })
  })
}
