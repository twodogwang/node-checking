

const query = require("../../module/sqlpool.js");
const GetUserInfo = require("../../module/getUserInfo.js").userInfo;
exports.intentionCustomer = function(req,res){
    console.log("intentionCustomer")
    const UserInfo = GetUserInfo(req)
    const Level = UserInfo.permissionLevel
    const userID = Number(UserInfo.u_id)
    if( Level === 3 ){
        let sellecttotal = new Promise((resolve,reject)=>{
            let total = `SELECT c.customerId FROM customer c 
            LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
            WHERE c.come_rate = 1  AND c.c_mean = "意向客户" AND c.lr_renyuan in (SELECT u_id FROM user WHERE superior = ${userID})`
            query(total,(err,results,fields)=>{
                if(err) return reject(err)
                resolve(results.length)
            })
        })
        sellecttotal.then((result)=>{
            let curPage = req.query.pageNum
            let pageSize = req.query.pageSize
            if(result === 0){
                return res.send({
                    'code':20000,
                    'msg':"意向客户为空",
                    'data':{
                        list:[],
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            }
            if( result < pageSize ){
                var sqltatil = ` LIMIT ${result*(curPage-1)},${result}`
            }else{
                var sqltatil = ` LIMIT ${pageSize*(curPage-1)},${pageSize}`
            }
            let sql = `SELECT 
                c.customerId,
                c.c_mean,
                c.ifcome,
                c.c_name,
                u.u_username,
                date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
                c.who,
                c.c_mean,
                c.done,
                c.kf_tel,
                c.kf_tel_bz,
                c.c_bz,
                c.done_time,
                oo.proType,
                oo.acceptData
                FROM customer c 
                LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
                LEFT JOIN user u ON u.u_id = c.lr_renyuan
                WHERE c.come_rate = 1  AND c.c_mean = "意向客户" AND c.lr_renyuan in (SELECT u_id FROM user WHERE superior = ${userID})
                ORDER BY c.customerId DESC `
            sql += sqltatil
            console.log(sql)
            query(sql,(err,results,fields)=>{
                if(err) return console.error(err)
                res.send({
                    'code':20000,
                    'msg':"获取成功",
                    'data':{
                        list:results,
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            })
        })
    }else if( Level === 4 ){
        let username = UserInfo.u_username
        let sellecttotal = new Promise((resolve,reject)=>{
            let total = `SELECT c.customerId FROM customer c 
            LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
            WHERE c.come_rate = 1  AND c.c_mean = "意向客户" AND (c.lr_renyuan  = ${userID} OR kf_tel = "${username}")`
            query(total,(err,results,fields)=>{
                if(err) return reject(err)
                resolve(results.length)
            })
        })
        sellecttotal.then((result)=>{
            let curPage = req.query.pageNum
            let pageSize = req.query.pageSize
            if(result === 0){
                return res.send({
                    'code':20000,
                    'msg':"意向客户为空",
                    'data':{
                        list:[],
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            }
            if( result < pageSize ){
                var sqltatil = ` LIMIT ${result*(curPage-1)},${result}`
            }else{
                var sqltatil = ` LIMIT ${pageSize*(curPage-1)},${pageSize}`
            }
            let sql = `SELECT 
                c.customerId,
                c.c_mean,
                c.ifcome,
                c.c_name,
                date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
                c.who,
                c.c_mean,
                c.done,
                c.c_tel,
                c.kf_tel,
                c.kf_tel_bz,
                c.c_bz,
                u.u_username,
                c.done_time,
                oo.proType,
                oo.acceptData
                FROM customer c 
                LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
                LEFT JOIN user u ON u.u_id = c.lr_renyuan
                WHERE c.come_rate = 1  AND c.c_mean = "意向客户" AND (c.lr_renyuan  = ${userID} OR kf_tel = "${username}")
                ORDER BY c.customerId DESC `
            sql += sqltatil
            console.log(sql)
            query(sql,(err,results,fields)=>{
                if(err) return console.error(err)
                res.send({
                    'code':20000,
                    'msg':"获取成功",
                    'data':{
                        list:results,
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            })
        })
    }else{
        let sellecttotal = new Promise((resolve,reject)=>{
            let total = `SELECT c.customerId FROM customer c 
            LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
            WHERE c.come_rate = 1  AND c.c_mean = "意向客户"`
            query(total,(err,results,fields)=>{
                if(err) return reject(err)
                resolve(results.length)
            })
        })
        sellecttotal.then((result)=>{
            let curPage = req.query.pageNum
            let pageSize = req.query.pageSize
            if(result === 0){
                return res.send({
                    'code':20000,
                    'msg':"意向客户为空",
                    'data':{
                        list:[],
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            }
            if( result < pageSize ){
                var sqltatil = ` LIMIT ${result*(curPage-1)},${result}`
            }else{
                var sqltatil = ` LIMIT ${pageSize*(curPage-1)},${pageSize}`
            }
            let sql = `SELECT 
                c.customerId,
                c.c_mean,
                c.ifcome,
                c.c_name,
                date_format(c.m_addtime,'%Y-%m-%d') as m_addtime,
                c.who,
                c.c_tel,
                c.c_mean,
                c.done,
                c.kf_tel,
                c.kf_tel_bz,
                c.c_bz,
                u.u_username,
                c.done_time,
                oo.proType,
                oo.acceptData
                FROM customer c 
                LEFT JOIN orderyuegui oo ON oo.customerId = c.customerId
                LEFT JOIN user u ON u.u_id = c.lr_renyuan
                WHERE c.come_rate = 1  AND c.c_mean = "意向客户"
                ORDER BY c.customerId DESC `
            sql += sqltatil
            console.log(sql)
            query(sql,(err,results,fields)=>{
                if(err) return console.error(err)
                res.send({
                    'code':20000,
                    'msg':"获取成功",
                    'data':{
                        list:results,
                        pageNum:Number(curPage),
                        pageSize:Number(pageSize),
                        totalItems:Number(result)
                    }
                })
            })
        })
    }
}
// router.get("/customer/intentionCustomer",(req,res)=>{})
