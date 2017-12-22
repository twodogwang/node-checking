const express = require("express");

const bodyParser = require("body-parser");

const app = express();

var cookieParser = require("cookie-parser");
const query = require("./module/sqlpool.js");
const decode = require('./module/token').token.decodeToken;


app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const server = require("http").createServer(app);

const io = require("socket.io")(server);

const login = require("./router/login")

const adminInfo = require("./router/adminInfo")

const customer = require("./router/customer")

const follow = require("./router/follow")

const getUser = require("./router/getUser")

const order = require("./router/order")

const statistics = require("./router/statistics")

const message = require('./controllers/pushmessage')


const chargepermission = require("./module/chargepermission")
// const port = "192.168.1.200";
// const port = "127.0.0.1";
server.listen(28889/* , port */);
console.log("正在监听:" /* + port */ + ":28889");
app.use(express.static("./public"));
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://www.bjxiyang.com");
  res.header("Access-Control-Allow-Origin", "http://192.168.1.173:9528");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Token");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  res.header('Access-Control-Max-Age', '1728000');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");

  next()
});

app.use(function (req, res, next) {
  let handleUrl = req._parsedUrl.pathname;
  console.log("handleUrl", handleUrl)
  //next()
  if (handleUrl === "/user/login" || handleUrl === "/user/info"|| handleUrl === "/user/logout") {
    next();
  } else {
    if (req.method === 'OPTIONS') {
      next()
    } else {
      let Xtoken = req.header("X-Token")
      let permissionState = chargepermission(req, res, Xtoken)
      permissionState.then(result => {
        console.log("permissionState", result, handleUrl)
        if (result === 'success') {
          next();
        } else if (result === 'nopermission') {
          res.send({ 'code': 10000, 'msg': '由于某种原因你不能执行这个操作或者你不能获取某些数据' })
        }
      })
    }
  }
})

app.use(login)

app.use(adminInfo)

app.use(customer)

app.use(follow)

app.use(getUser)

app.use(order)

app.use(statistics)
/*推送*/
var userServer = {};
var userList = {};
var count = 0;
var userMysql = "SELECT u_username,u_id FROM user";
query(userMysql, function (err, results, fields) {
  if (err) return console.log(err);
  for (let i = 0; i < results.length; i++) {
    userList[results[i].u_id] = results[i].u_username;
  }
})

io.on("connection", function (socket) {
  count += 1;
  socket.on("newUser", function (data) {
    const user_id = decode(data).payload.data.u_id;

    if (!userList[user_id]) {
      var newUserMysql = "SELECT u_username,u_id FROM user WHERE u_id =" + user_id;
      console.log("新用户" + user_id)
      query(newUserMysql, function (err, results, fields) {
        if (err) return console.log(err);
        userList[results[0].u_id] = results[0].u_username;
      })
    }
    socket.id = user_id;
    userServer[`${user_id}lxl`] = socket;
    console.log(user_id + "连接了")
    io.emit("addCount", count);
  });
  socket.on("disconnect", function () {
    //用户注销登陆执行内容
    count -= 1;
    var id = socket.id;
    delete userServer[`${id}lxl`];
    io.emit("offline", {
      id: id
    });
    console.log('退出id', id)
    // io.emit("addCount", count);
  });
  socket.on("message", function (data) {
    console.log(data)
    // if (userServer.hasOwnProperty(`${data.to}lxl`)) {
    if (Array.isArray(data.to)) {
      let datalen = data.to.length
      for (let i = 0; i < datalen; i++) {
        var msg_sql = `insert into sendmsg (user_id,msg,time) values (${data.to[i]},"${data.msg}",NOW())`
        if (userServer.hasOwnProperty(`${data.to[i]}lxl`)) {
          console.log(msg_sql)
          query(msg_sql, function (err, results, fields) {
            if (err) return console.log(err);
            console.log(results)
            var msg_id = results.insertId;
            userServer[`${data.to[i]}lxl`].emit("getMsg", {
              msg: data.msg,
              time: data.time,
              msg_id: msg_id
            });
          });
        } else {
          console.log(msg_sql)
          query(msg_sql, function (err, results, fields) {
            if (err) return console.log(err);
            socket.emit("err", {
              msg: userList[data.to[i]] + "已经下线或者断开连接"
            });
          });
        }
      }
    } else {
      var msg_sql = `insert into sendmsg (user_id,msg,time) values (${data.to},"${data.msg}",NOW())`;
      if (userServer.hasOwnProperty(`${data.to}lxl`)) {
        query(msg_sql, function (err, results, fields) {
          if (err) return console.log(err);
          console.log(results)
          var msg_id = results.insertId;
          userServer[`${data.to}lxl`].emit("getMsg", {
            msg: data.msg,
            time: data.time,
            msg_id: msg_id
          });
        });
      } else {
        query(msg_sql, function (err, results, fields) {
          if (err) return console.log(err);
          socket.emit("err", {

            msg: userList[data.to] + "已经下线或者断开连接"
          });
        });
      }
    }
    /* } else {
      if (Array.isArray(data.to)) {
        let datalen = data.to.length
        var msg_sql = `insert into sendmsg (user_id,msg,time) values (`
        for (let i = 0; i < datalen; i++) {
          if (i == datalen - 1) {
            msg_sql += `${data.to[i]},"${data.msg}",NOW())`
          } else {
            msg_sql += `${data.to[i]},"${data.msg}",NOW()),`
          }
        }
        //var msg_sql = `insert into sendmsg (user_id,msg,time) values (${data.to},"${data.msg}",NOW())`;
        query(msg_sql, function (err, results, fields) {
          if (err) return console.log(err);
          socket.emit("err", {
            msg: userList[data.to] + "已经下线或者断开连接"
          });
        });
      } else {
        var msg_sql = `insert into sendmsg (user_id,msg,time) values (${data.to},"${data.msg}",NOW())`;
        console.log(msg_sql)
        query(msg_sql, function (err, results, fields) {
          if (err) return console.log(err);
          socket.emit("err", {
            msg: userList[data.to] + "已经下线或者断开连接"
          });
        });
      }
    } */
  });

  // socket.on("disconnect", function() {
  //     //用户注销登陆执行内容
  //     count -= 1;
  //     var id = socket.id;
  //     console.log("id="+id+"的用户下线了")
  //     delete userServer[id];
  //     delete userList[id];
  //     io.emit("offline", { id: id });
  //     io.emit("addCount", count);

  // });
});

app.get('/message/getMessage', message.getMessage)

app.get('/message/readMessage', message.readMessage)

/*推送*/



process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
})
