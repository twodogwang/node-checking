const now = require("../time.js");
const log = require("../log.js").log;
const log1 = require("../log.js").log1;
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;

function randomString(len) {
  len = len || 32;
  var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = "";
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

exports.login = function (req, res) {
  console.log(req.body)
  var c_password = secret(req.body.password);
  /* 
    登录后密码先加密，然后再跟数据库对比
    然后获取该用户的权限，
    然后用  tokenobj = {
            role_id: user_role_id,
            u_username: user_name,
            u_id: user_id,
            url: url,
            permissionLevel: permissionLevel,
            superior: superior,
            role_name:role_name
          }
    上面那个对象去生成token
    在后面所有的请求中都会携带这个token，解析这个token可以得到 上面那个对象，就能拿到用户的ID username url（权限）分组ID 权限等级 分组名称 上级ID
  */
  var chasql = `SELECT
  user.u_username,
  user.u_id,
  user_role.role_id,
  user.permissionLevel,
  user.superior,
  role.role_name
  FROM
  user
  LEFT JOIN user_role ON user.u_id = user_role.u_id
  INNER JOIN role ON user_role.role_id = role.role_id
  WHERE user.u_username="${req.body.username}" AND user.u_password ="${c_password}"`;
  var time = now.format("yyyy年MM月dd日 hh:mm:ss");
  console.log(chasql)
  query(chasql, function (err, results, fields) {
    try {
      if (results.length == 0) {
        res.send({ code: 10000, msg: "账号或密码错误" });
      } else {
        let user_role_id = results[0].role_id
        let user_id = results[0].u_id
        let user_name = results[0].u_username
        let permissionLevel = results[0].permissionLevel
        let superior = results[0].superior
        let role_name = results[0].role_name
        let sql = `SELECT
          p.url
          FROM
          user AS u
          INNER JOIN user_role AS ur ON u.u_id = ur.u_id
          INNER JOIN role ON ur.role_id = role.role_id
          INNER JOIN role_permission AS rp ON role.role_id = rp.role_id
          INNER JOIN permission2 AS p ON rp.permission_id = p.id
          WHERE
          u.u_id = ${user_id}`
        console.log(sql)
        query(sql, (err, results, fields) => {
          if (err) console.error(err)
          let url = []
          var len = results.length
          for(let i = 0; i < len;i++){
            url.push(results[i].url)
          }
          console.log(url)
          var tokenobj = {
            role_id: user_role_id,
            u_username: user_name,
            u_id: user_id,
            url: url,
            permissionLevel: permissionLevel,
            superior: superior,
            role_name:role_name
          }
          var createtoken = token.createToken(tokenobj, 145152000);
          var myrandomString = randomString(6);
          myrandomString += user_id;
          let sql3 = `INSERT INTO cookie_token (cookie,token,created,exp) VALUES ("${myrandomString}","${createtoken}",NOW(),"145152000")`
          console.log(sql3)
          query(sql3, (err, results, fields) => {
            if (err) console.error(err)
            res.send({
              'code': 20000,
              'data': { 'token': createtoken }
            })
          })
        })
      }
    } catch (err) {
      console.log(err);
    }
  });
}
// router.post("/user/login", function(req, res) {});

