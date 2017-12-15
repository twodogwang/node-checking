const query = require("../../module/sqlpool.js");
const token = require("../../module/token.js").token;

exports.userinfo = function (req, res) {
  let Xtoken = req.header("X-Token")
  let sql = `SELECT token FROM cookie_token WHERE token = "${Xtoken}"`
  let checkToken = new Promise((resolve, reject) => {
    query(sql, (err, results, fields) => {
      if (err) console.error(err)
      if (results.length == 0) {
        resolve({ 'code': 50014 })
      } else {
        let tokendata = token.decodeToken(results[0].token);
        console.log(tokendata)
        let now = (new Date().getTime()) / 1000
        let tokenCreated = tokendata.payload.created
        let tokenExp = tokendata.payload.exp
        let newExp = now - tokenCreated
        if (newExp > tokenExp) {
          let sql2 = `DELETE FROM cookie_token WHERE token = "${results[0].token}"`
          query(sql2, (err, results, fields) => {
            if (err) console.error(err)
            resolve({ 'code': 50014 })
          })
        } else {
          resolve({
            obj: {
              'code': 20000,
              'msg': "登录成功",
              'data': {
                'role': [tokendata.payload.data.permissionLevel],
                'name': tokendata.payload.data.u_username,
                'roleName':tokendata.payload.data.role_name
              }
            },
            user_id:tokendata.payload.data.u_id
          })
        }
      }
    })
  })

  checkToken.then((result) => {
    let sql = `SELECT
    GROUP_CONCAT(m.menu Separator ",") as menu
    FROM
    user AS u
    INNER JOIN user_role AS ur ON u.u_id = ur.u_id
    INNER JOIN role ON ur.role_id = role.role_id
    INNER JOIN role_menu AS rm ON role.role_id = rm.role_id
    INNER JOIN menu1 AS m ON rm.menuId = m.id
    WHERE
    u.u_id =  ${result.user_id}`
    console.log(sql)
    query(sql, (err, results, fields) => {
      if (err) return console.error(err)
      result.obj.data.routers = results[0].menu.split(",")
      res.send(result.obj)
    })
  })
}

// router.get("/user/info",(req,res)=>{})

