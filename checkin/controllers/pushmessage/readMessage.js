const now = require("../time.js");
const log = require("../log.js").log;
const log1 = require("../log.js").log1;
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;
const getUserId = require('../../module/getUserInfo').userId;

exports.readMessage = function (req, res) {
    const user_id = getUserId(req);
    var read_sql = ` UPDATE sendmsg SET haveread = 1,readtime=NOW() WHERE user_id = ${user_id} and msg_id = ${req.query.msg_id}`;
    query(read_sql, function (err, results, fields) {
        try {
            if (results.affectedRows > 0) {
                res.send({
                    code: 20000,
                    msg: '已阅'
                });
            }
        } catch (err) {
            log1(err);
        }
    });
}
