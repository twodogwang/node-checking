const query = require("../../module/sqlpool.js")
const GetUserInfo = require("../../module/getUserInfo.js").userInfo


exports.checkBz = (req,res)=>{
    const customerId = req.query.customerId;
    /* 
        查看备注
    */
    let chasql = `SELECT c_bz FROM  customer WHERE customerId = ${customerId}`;
    query(chasql, function(err, results, fields) {
        if (err) return log1(err);
        res.json({
            "code":20000,
            "c_bz":results[0].c_bz
        })
    });
}

