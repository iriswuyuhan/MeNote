var express = require('express');
var router = express.Router();

//TODO 需要做一些拦截器

router.get('/login', function (req, res, next) {
    //这里应该用sqlite处理登录
    
});

module.exports = router;
