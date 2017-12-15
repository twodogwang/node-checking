const query = require("../../module/sqlpool.js")
const GetUserInfo = require("../../module/getUserInfo.js").userInfo

exports.changeChannel = (req, res) => {
    const orderId = req.body.id
    const info = GetUserInfo(req)
    const mysql = `UPDATE orderYuegui SET way="${req.body.way}" WHERE id=${orderId} AND proType !="已完成"`;
    console.log("更改渠道sql:" + mysql);
    query(mysql, function (err, results, fields) {
        if (err) return console.log(err);
        if (results.affectedRows > 0) {
            res.send({
              "code": 20000,
              "msg": "渠道更改成功",
              superior:info.superior
            });
        } else {
            res.send({ "code": 10000, "msg": "渠道更改失败" });
        }
    });
}
