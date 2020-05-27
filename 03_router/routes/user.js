var express = require("express");
var router = express.Router();

// localhost:3333/user
router.get('/', function (req, res, next) {
    res.send('USER !')
})

// localhost:3333/user/profile
router.get('/profile', function (req, res, next) {
    res.send('USER PROFILE')
})

module.exports = router;