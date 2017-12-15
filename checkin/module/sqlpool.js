var mysql = require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: '2510129',
    password: '123456',
    database: 'checkin'
});
// var pool = mysql.createPool({
//     host: 'rm-8vb1tf7f3mt7695b1.mysql.zhangbei.rds.aliyuncs.com',
//     user: 'zsqroot',
//     password: 'Hyy520595',
//     database: 'ppxt'
// });
var query = function(sql, options, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, options, function(err, results, fields) {
                //事件驱动回调
                callback(err, results, fields);

            });
            //释放连接
            conn.release();
        }
    });
};
//使用方法:
// query("select * from table where id=?", [1], function(err,results,fields){
//     //do something
// });
module.exports = query;
