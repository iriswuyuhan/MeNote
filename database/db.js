var sqlite = require('sqlite3');

var db = new sqlite.Database('test.db', function () {
    db.run("select * from user", function (err, res) {
        if (!err) {
            console.log(res);
        }
        else {
            console.error(err);
        }
    })
});