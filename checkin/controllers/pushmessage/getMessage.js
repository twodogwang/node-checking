const getUserId = require('../../module/getUserInfo').userId;
const now = require("../time.js");
const log = require("../log.js").log;
const log1 = require("../log.js").log1;
const query = require("../../module/sqlpool.js");
const secret = require("../../module/token.js").secret;
const token = require("../../module/token.js").token;

exports.getMessage = function (req, res) {
    const user_id = getUserId(req);
    var select_sql = ` SELECT msg,msg_id,time FROM  sendmsg WHERE user_id = ${user_id} and haveread = 0`;
    query(select_sql, function (err, results, fields) {
        try {
            if (results.length > 0) {
                res.send({
                    code: 20000,
                    msg:`您有${results.length}条未读信息`,
                    results
                });
            } else {
                res.send({ code: 20000,msg:"暂无新信息" });
            }
        } catch (err) {
            log1(err);
        }
    });
}
