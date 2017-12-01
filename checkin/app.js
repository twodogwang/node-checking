var express = require("express");

var bodyParser = require("body-parser");

var app = express();

var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
const server = require("http").createServer(app);

const login = require("./controllers/login")

const adminInfo = require("./controllers/adminInfo")


const chargepermission = require("./module/chargepermission")
const port = "192.168.1.200";
server.listen("28888", port);
console.log("正在监听:" + port + ":28888");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next()
});
app.use(function (req, res, next) {
    let handleUrl = req.originalUrl;
    console.log("handleUrl", handleUrl)
    next()
    /* if (handleUrl === "/user/login" || handleUrl === "/user/info") {
        next();
    } else {
        if (req.method === 'OPTIONS') {
            next()
        } else {
            let Xtoken = req.header("X-Token")
            let permissionState = chargepermission(req, res, Xtoken)
            permissionState.then(result=>{
                console.log("permissionState",result,handleUrl)
                if (result === 'success') {
                    next();
                } else if (result === 'nopermission') {
                    res.send({ 'code': 50014, 'msg': '你无权执行此操作' })
                }
            })
            
        }
    } */

})



/* 登录和获取info */
app.post("/user/login", login.login)

app.get("/user/info", login.userinfo)
/* 登录和获取info */

/*  */
app.get("/user/getrolename", adminInfo.getrolename)

app.post("/user/register", adminInfo.register)

app.get("/user/admininfo", adminInfo.admininfo)

app.post("/user/editManager", adminInfo.editManager)

app.get("/user/getManagerSingle", adminInfo.getManagerSingle)

app.get("/user/getManagerUser", adminInfo.getManagerUser)

app.get("/group/getGroupInfo", adminInfo.getGroupInfo)

app.post("/group/addGroup", adminInfo.addGroup)

app.post("/user/deleUser", adminInfo.deleUser)

app.post("/group/deleGroup", adminInfo.deleGroup)

app.get("/permission/getPermissionList", adminInfo.getPermissionList)

app.post("/permission/addPermission", adminInfo.addPermission)

app.get("/permission/selectPermission", adminInfo.selectPermission)

app.post("/permission/editPermission", adminInfo.editPermission)

app.post("/permission/delePermission", adminInfo.delePermission)






process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
