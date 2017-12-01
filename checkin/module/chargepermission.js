const dectoken = require("./token.js").token;
const query = require("./sqlpool.js");
function permission(req,res,token) {
    let checkToken = new Promise((resolve,reject)=>{
        console.log('chargingpermission')
        let sql = `SELECT token FROM cookie_token WHERE token = "${token}"`
        query(sql,(err,results,fields)=>{
            if(err) console.error(err)
            if(results.length == 0){
                resolve({'code':50014})
            }else{
                let tokendata = dectoken.decodeToken(results[0].token);
                let now = (new Date().getTime())/1000
                let tokenCreated = tokendata.payload.created
                let tokenExp = tokendata.payload.exp
                let newExp = now - tokenCreated
                if(newExp > tokenExp){
                    let sql2 = `DELETE FROM cookie_token WHERE token = "${results[0].token}"`
                    query(sql2,(err,results,fields)=>{
                        if(err) console.error(err)
                        resolve({'code':50014})
                    })
                }else{
                    let permissionUrl = tokendata.payload.data.url
                    console.log("permissionUrl",permissionUrl)
                    let handleUrl = req.originalUrl;
                    if(permissionUrl.indexOf(handleUrl) > -1){
                        resolve({'code':20000})
                    }else{
                        resolve({'code':30000})
                    }
                }
            }
        })
    })
    return checkToken.then((result)=>{
        if(result.code == 20000){
            return 'success'
        }else if (result.code == 30000){
            return 'nopermission'
        }else{
            return result
        }
    })
}


module.exports = permission