var token = require("../../module/token.js").token;
function decmytoken(req, res, mytoken) {
    if(mytoken){
        const code = token.checkToken(mytoken);
        if (code == 404) {
            res.redirect("/token404");
        } else if (code == 500) {
            res.redirect("/token500");
        } else if(code == 'timeout'){
            res.redirect("/token500");
        }else {
            var tokendata = token.decodeToken(mytoken).payload.data;
            var role_id = tokendata.info.role_id,
                u_username = tokendata.info.u_username,
                u_id = tokendata.info.u_id;
            permission = tokendata.permission;
            myurl = tokendata.url;
            return (obj = {
                token: mytoken,
                role_id: role_id,
                u_id: u_id,
                u_username: u_username,
                permission: permission,
                url: myurl
            });
        }
    }else{
        res.redirect("/token500")
    }
}

exports.dectoken = function(req, res) {
    if (req.cookies.user&& global.bjxiyangToken) {
        const token = global.bjxiyangToken[req.cookies.user.username][req.cookies.user.tokenid];
        const data = decmytoken(req, res, token);
        const nowpath = req.route.path;
        if (data.url[0].url.indexOf(nowpath) > -1) {
            return data;
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};
