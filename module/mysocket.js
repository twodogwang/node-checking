/*推送*/
var userServer = {};
var userList = {};
var count = 0;
io.on('connection', function(socket) {
    count += 1;
    socket.on('newUser', function(data) {
        var nickname = data.user_name,
            user_id = data.user_id;
        socket.id = user_id;
        userServer[user_id] = socket;
        userList[user_id] = nickname
        io.emit('addCount', count)
    })
    socket.on('disconnect', function() { //用户注销登陆执行内容
        count -= 1;
        var id = socket.id
        delete userServer[id]
        delete userList[id]
        io.emit('offline', { id: id })
        io.emit('addCount', count)
    })
    socket.on('message', function(data) {
        if (userServer.hasOwnProperty(data.to)) {
            var msg_sql = `insert into sendmsg (user_id,msg,time) values (${data.to},"${data.msg}",NOW())`;
            query(msg_sql, function(err, results, fields) {
                var msg_id = results.insertId;
                userServer[data.to].emit('getMsg', { "msg": data.msg, "msg_id": msg_id })
            })
        } else {
            var msg_sql = `insert into sendmsg (user_id,msg,time) values (${data.to},"${data.msg}",NOW())`
            query(msg_sql, function(err, results, fields) {})
            socket.emit("err", { msg: "对方已经下线或者断开连接" })
        }
    })

    socket.on('disconnect', function() { //用户注销登陆执行内容
        count -= 1;
        var id = socket.id
        delete userServer[id]
        delete userList[id]
        io.emit('offline', { id: id })
        io.emit('addCount', count)
    })
})

/*推送*/