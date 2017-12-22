const query = require("../../module/sqlpool.js")
const permissionLevel = require("../../module/getUserInfo.js").permissionLevel
const getUserId = require("../../module/getUserInfo.js").userId

exports.waitForAccept = function (req, res) {
    console.log("waitForAccept")
    const Level = permissionLevel(req)
    const UserId = getUserId(req)
    /* 
        获取待接收订单
    */
    switch (Level) {
        case 6:
            var pageSql = `SELECT id FROM orderYuegui WHERE ifaccept = '0' AND ifpass = 1  AND ifback = '0' AND MangerId = ${UserId}`
            var sqltatil = ` AND MangerId = ${UserId} `
            break;
        case 1:
        case 2:
            var pageSql = `SELECT id FROM orderYuegui WHERE ifaccept = '0' AND ifpass = 1  AND ifback = '0'`
            var sqltatil = ""
            break;
    }

    let pagePromise = new Promise((resolve, reject) => {
        console.log(pageSql)
        query(pageSql, (err, results, fields) => {
            if (err) return console.error(err)
            resolve(results.length)
        })
    })
    pagePromise.then((result) => {
        let curPage = req.query.pageNum
        let pageSize = req.query.pageSize
        if (result === 0) {
            return res.send({
                'code': 20000,
                'msg': "待转移客户为空",
                'data': {
                    list: [],
                    pageNum: Number(curPage),
                    pageSize: Number(pageSize),
                    totalItems: Number(result)
                }
            })
        }else{
            if( result < pageSize ){
                var sqltatil1 = ` ORDER BY id DESC LIMIT ${result*(curPage-1)},${result}`
            }else{
                var sqltatil1 = ` ORDER BY id DESC LIMIT ${pageSize*(curPage-1)},${pageSize}`
            }
            let sql = `SELECT
            id,
            proNum,
            customerName,
            customerTel,
            businessBigType,
            businessSmallType,
            businessRequire,
            dianziRequire,
            way,
            lr_renyuan,
            proType,
            proSchedule,
            dianziSchedule,
            acceptData,
            lastUpdate,
            customerId,
            proNewdata,
            tip
            FROM orderYuegui
            WHERE
            ifaccept = '0' AND ifpass = '1'  AND ifback = '0' `;/* ORDER BY id DESC */
            sql += sqltatil
            sql += sqltatil1
            console.log(sql)
            query(sql,(err,results,fields)=>{
                if(err) return console.error(err)
                let len = results.length
                if(Level !== 1){
                    for(let i = 0; i < len;i++){
                        delete results[i].customerTel
                    }
                }
                res.send({
                    code:20000,
                    msg:"获取成功",
                    data:{
                        list:results,
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            })
        }
    })

}
// router.get("/order/getAllorder",(req,res)=>{})
