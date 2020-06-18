var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var port = 3333;
var path = require('path');
var session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'kytrk*()*^*$%^#$Hhtrd.hggfsgg#@$#@^#$^J@$',
        resave: false,
        saveUninitialized: true
    })
);

var mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'blockchain2102',
    database: 'test'
})

app.get('/', function(req, res){
    console.log(req.session);
    res.render('home', { user: req.session.loggedIn });
});

app.get('/login', function(req, res) {
    res.render('login', { error: false, user: req.session.loggedIn });
});

app.post('/login', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    connection.query(
        `SELECT * from users WHERE email=? and password=?`,
        [email, password],
        function(err, users) {
            if ( err ) {
                console.log(err); // 오류
                res.render('error');
            } else if ( users.length > 0 ) { // users 값이 있음
                req.session.loggedIn = users[0];
                res.redirect('/');
            } else { // users 값이 없음 (빈 list)
                res.render('login', { error: true, user: req.session.loggedIn });
            }
        }
    )
});

app.get('/signup', function(req, res) {
    res.render('signup', { errorMessage: null, user: req.session.loggedIn });
});

app.post('/signup', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    var age = null;
    if ( req.body.age ) {
        age = req.body.age
    }

    connection.query(
        `SELECT id from users WHERE email=?`, // email이 같은 user의 id 찾기
        [email],
        function(err, users) {
            if ( err ) { // 오류 발생
                res.render('signup', { errorMessage: "오류 발생", user: req.session.loggedIn });
            } else if (users.length > 0) { // 이미 존재하는 이메일
                res.render('signup', { errorMessage: "이미 존재하는 이메일", user: req.session.loggedIn });
            } else { // email이 `users` table에 없을 경우
                connection.query(
                    `INSERT INTO users (email, password, age)
                        VALUES (?, ?, ?)`,
                    [email, password, age],
                    function(err2, result) {
                        if ( err2 ) { // 오류 발생
                            res.render('signup', { errorMessage: "생성 오류", user: req.session.loggedIn });
                        } else { // INSERT 성공
                            res.render('login', { error: false, user: req.session.loggedIn })
                        }
                    }
                )
            }
        }
    )
});

app.get('/logout', function(req, res) {
    if (req.session.loggedIn) { // 로그인 정보가 있으면 
        req.session.destroy(function(err) {
            if ( err ) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
})

app.get('/list', function(req, res) {
    connection.query('SELECT * from users', function(err, rows) {
        if ( err ) {
            console.log(err);
            res.render('error');
        } else {
            res.render('list', { users: rows, user: req.session.loggedIn });
        }
    })
});

app.get('/posts', function(req, res) {
    if (!req.session.loggedIn) {
        res.redirect('/logout')
    } else {
        connection.query(`
            select post_id, title, email, user_id, view_count, likes 
                from posts
                left join users
                on user_id = users.id
        `, function (err, posts) {
            if ( err ) {
                res.render("error");
            } else {
                res.render('posts', { 
                    user: req.session.loggedIn,
                    posts: posts 
                })
            }
        })
    }
})

app.get('/post/:postId', function(req, res) {
    if ( !req.session.loggedIn ) {
        res.redirect('/logout')
    } else {
        const postId= req.params.postId;
        connection.query(`
            select post_id, title, contents, email, user_id, view_count 
                from posts
                left join users
                on user_id = users.id
                where post_id = ?
        `, [postId], function(err, posts) {
            if ( err ) {
                res.render('error');
            } else if ( posts.length < 1 ) {
                console.log('post가 없음')
                res.render('error');
            } else {
                connection.query(
                    `select comment_id, description, user_id, email from comments
                        left join users
                        on user_id = users.id
                        where post_id = ?
                        order by comment_id desc`,
                    [postId],
                    function(err, comments) {
                        if ( err ) {
                            res.render('error');
                        } else {
                            const target = posts[0];
                            if (target.user_id == req.session.loggedIn.id) {
                                res.render('post', { 
                                    user: req.session.loggedIn,
                                    post: posts[0],
                                    comments: comments
                                });
                            } else {
                                connection.query(
                                    `update posts set
                                        view_count=? where post_id=?`,
                                    [target.view_count + 1, postId],
                                    function(err, result) {
                                        if ( err ) {
                                            res.render('error');
                                        } else {
                                            res.render('post', { 
                                                user: req.session.loggedIn,
                                                post: posts[0],
                                                comments: comments
                                            });
                                        }
                                    }
                                )
                            }
                        }
                    }
                );
            }
        })
    }
});

app.get('/post/delete/:postId', function(req, res) {
    if (!req.session.loggedIn) {
        res.redirect('/logout')
    } else {
        const postId = Number(req.params.postId);
        connection.query(
            `delete from posts where post_id = ?`,
            [postId],
            function(err, result) {
                if ( err ) {
                    console.log(err);
                    res.render('error');
                } else {
                    res.redirect('/posts');
                }
            }
        )
    }
})

app.get('/posts/create', function(req, res) {
    if (!req.session.loggedIn) {
        res.redirect('/logout')
    } else {
        res.render('editPost', {
            user: req.session.loggedIn,
            action: '/posts/create',
            post: { title: "", contents: "" }
        })
    }
});

app.post('/posts/create', function(req, res) {
    if ( !req.session.loggedIn ) {
        res.redirect('/logout')
    } else {
        const title = req.body.title;
        const contents = req.body.contents;
        connection.query(
            `insert into posts (title, contents, user_id)
                values (?, ?, ?)`, 
            [title, contents, req.session.loggedIn.id], 
            function(err, result) {
                if ( err ) {
                    res.render('error');
                } else {
                    res.redirect('/posts');
                }
            }
        )
    }
})

app.get('/post/edit/:postId', function(req, res) {
    if ( !req.session.loggedIn ) {
        res.redirect('/logout')
    } else { 
        const postId = req.params.postId;
        connection.query(
            `select * from posts
                where user_id = ? and post_id = ?`,
            [req.session.loggedIn.id, postId],
            function(err, rows) {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else if ( rows.length < 1) {
                    res.render('error');
                } else {
                    res.render('editPost', {
                        user: req.session.loggedIn,
                        post: rows[0],
                        action: '/post/edit/' + postId
                    })
                }
            }
        )
    }
})

/**
 * 업데이트 쿼리
 * update posts set title="...", contents="..." where post_id = 1
 * 
 * -> 수정 페이지 POST method 만들기!
 * 조건!
 * - 오류 발생 시 error 페이지로 이동
 * - 성공 시 /posts 페이지로 이동 (게시판 목록)
 */
app.post('/post/edit/:postId', function(req, res) {
    if (!req.session.loggedIn) {
        res.render('error');
    } else {
        const postId = req.params.postId;
        const title = req.body.title;
        const contents = req.body.contents;
        connection.query(
            `update posts set title=?, contents=? where post_id=?`,
            [title, contents, postId],
            function(err, result) {
                if ( err ) {
                    res.render('error');
                } else {
                    res.redirect('/posts');
                }
            }
        )
    }
})

app.get('/post/like/:postId', function(req, res) {
    if (!req.session.loggedIn) {
        res.render('error');
    } else {
        const postId = req.params.postId;
        connection.query(
            `select likes from posts where post_id=?`,
            [postId],
            function(err, posts) {
                if ( err ) {
                    res.render('error');
                } else if (posts.length < 1) {
                    res.render('error');
                } else {
                    const target = posts[0];
                    connection.query(
                        `update posts set
                            likes=? where post_id=?`,
                        [target.likes + 1, postId],
                        function(err, result) {
                            if ( err ) {
                                res.render('error')
                            } else {
                                res.redirect('/posts')
                            }
                        }
                    )
                }
            }
        )
    }
})

server.listen(port, function() {
    console.log('웹 서버 시작', port);
});
