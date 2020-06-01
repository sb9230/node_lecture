var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var port = 3333;
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'blockchain2102',
    database: 'test'
})

app.get('/', function(req, res){
    res.render('home');
})

// localhost:3333/list
// app.get(`URL`, function )
// connection.query(`QUERY`, function)
app.get('/list', function(req, res) {
    connection.query('SELECT * from users', function(err, rows) {
        if ( err ) {
            console.log(err);
        }
        console.log(rows)
        res.render('list', { users: rows });
    })
})

server.listen(port, function() {
    console.log('웹 서버 시작', port);
})