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

//用户注册
router.post('/signup', urlEncoded, function (req, res, next) {
    //TODO 尚未检查重名用户,也未为之创建文件夹
    var params = req.body;
    var username = params.username;
    var password = params.password;

    var stmnt = "insert into user values(null,'" + username + "','" + password + "');"

    db.run(stmnt, function (err) {
        if (!err) {
            //TODO 还是交由后台吧
            fs.mkdir(path + username);
            res.send("1");//注册成功
        }
        else {
            console.error(err);
            res.send("0");//注册失败
        }
    })
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
                console.error(err);
            }

            if (bytes > 0) {
                res.send({content: buff.slice(0, bytes).toString()});
            }

            fs.close(fd, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    });
});

function deleteFile(src) {
    var files = [];
    //判断给定的路径是否存在
    if (fs.existsSync(src)) {
        //返回文件和子目录的数组
        if (fs.statSync(src).isDirectory()) {
            files = fs.readdirSync(src);
            files.forEach(function (file, index) {
                // var curPath = url + "/" + file;
                var curPath = path.join(src, file);
                //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                    // 是文件delete file
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            //清除文件夹
            fs.rmdirSync(src);
        }
        else {
            fs.unlinkSync(src);
        }
    } else {
        console.log("Not Exist!");
    }
}

//保存用户对笔记的修改
router.post('/saveNote', urlEncoded, function (req, res, next) {
    var params = req.body;
    var type = params.type;
    var username = params.path;
    var pathfile = params.pathfile;
    var filename = params.headline;
    var content = params.content;

    // fs.open(path+username+"/"+pathfile, 'w+', function (err, fd) {
    //     if (err) {
    //         console.error(err);
    //         res.send("0");
    //     }

    fs.writeFile(path + username + "/" + pathfile, content, function (err, written, string) {
        if (err) {
            console.error(err);
            res.send("0");
        }
    });
    // });

    if (type == "1") {
        fs.rename(path + username + "/" + pathfile, path + username + "/" + filename, function (err) {
            if (err) {
                console.error(err);
                res.send("0");
            }
            // deleteFile(path+username+"/"+pathfile);
        });
    }

    res.send("1");
});

module.exports = router;