//处理用户事务
var express = require('express');
var router = express.Router();

var bodyparser = require('body-parser');
var urlEncoded = bodyparser.urlencoded({extended: false});

var sqlite = require('sqlite3');
var db = new sqlite.Database('./database/test.db');

var fs = require('fs');

var path = "./notes/";

//TODO 需要做一些拦截器
//验证用户登录
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
                //读取用户note文件
                fs.readdir(path + username, function (err, files) {
                    if (!err) {
                        res.render('note', {username: username, files: files});
                    }
                    else {
                        console.error(err);
                    }
                });
            }
        }
        else {
            console.error(err);
        }
    });
});

//获取用户某个笔记
router.post('/getNote', urlEncoded, function (req, res, next) {
    var params = req.body;
    var username = params.username;
    var fileName = params.fileName;

    var buff = new Buffer(2048);
    fs.open(path + username + "/" + fileName, 'r+', function (err, fd) {
        if (err) {
            console.error(err);
        }

        fs.read(fd, buff, 0, buff.length, 0, function (err, bytes) {
            if (err) {
                console.log(err);
            }

            if (bytes > 0) {
                res.send({content: buff.slice(0, bytes).toString()});
            }
        });
    });
});

module.exports = router;