var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var port = 3333;
var path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "huemoneog0721",
  database: "test",
});

app.get("/", function (req, res) {
  res.render("home");
});

// localhost:3333/list
// app.get(`URL`, function )
// connection.query(`QUERY`, function)
app.get("/list", function (req, res) {
  connection.query("SELECT * from users", function (err, rows) {
    if (err) {
      console.log(err);
    }
    console.log(rows);
    res.render("list", { users: rows });
  });
});

app.get("/login", function (req, res) {
  res.render("login", { error: false });
});

app.post("/login", function (req, res) {
  connection.query(
    `SELECT * from users WHERE email = ? and password = ?`,
    [req.body.email, req.body.password],
    function (err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length > 0) {
        res.redirect("/");
      } else {
        console.log("rows ->", rows);
        res.render("login", { error: true });
      }
    }
  );
});

app.get("/signup", function (req, res) {
  res.render("signup", { errorMessage: null });
});

app.post("/signup", function (req, res) {
  console.log(req.body);
  const { email, password } = req.body;
  var age = null;
  if (req.body.age) {
    age = req.body.age;
  }
  connection.query(`SELECT id from users WHERE email=?`, [email], function (
    err,
    users
  ) {
    if (err) {
      console.log(err);
    } else if (users.length > 0) {
      res.render("signup", { errorMessage: "이미 존재하는 이메일 입니다." });
      console.log("users ->", users);
    } else {
      connection.query(
        "INSERT INTO users (email, password, age) VALUES (?,?,?)",
        [email, password, age],
        function (error, user) {
          if (error) {
            console.log(error);
            res.render("signup", { errorMessage: "회원 생성 시 오류 발생" });
          } else {
            res.render("login", { error: false });
          }
        }
      );
    }
  });
});

server.listen(port, function () {
  console.log("웹 서버 시작", port);
});
