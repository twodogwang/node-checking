const query = require("../../module/sqlpool.js");

exports.addMenu = function (req, res) {
  console.log("addMenu")
  let menu = req.body.menuUrl
  let Mdesc = req.body.menuName
  console.log(req.body)
  let sql = `INSERT INTO menu1 (menu,Mdesc) VALUES ("${menu}","${Mdesc}")`
  console.log(sql)
  query(sql, (err, results, fields) => {
    if (err) return console.error(err)
    res.send({ 'code': 20000, 'msg': "添加菜单成功" })
  })
}
