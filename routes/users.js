//处理用户事务
var express = require('express');
var router = express.Router();

var bodyparser = require('body-parser');
var urlEncoded = bodyparser.urlencoded({extended: false});

var sqlite = require('sqlite3');
var db = new sqlite.Database('./database/test.db');

//TODO 需要做一些拦截器

router.post('/login', urlEncoded, function (req, res, next) {
    var params = req.body;
    var username = params.username;
    var password = params.password;

    //这里用sqlite处理登录
    var stmnt = "select * from user where name='" + username + "'";
    db.all(stmnt, function (err, result) {
        if (!err) {
            //TODO 这里需要对结果集进行一些判断
            if (password == result[0]['password']) {
                console.log('success');
                //改一下
                res.redirect('../');
            }
        }
        else {
            console.error(err);
        }
    });
});

module.exports = router;