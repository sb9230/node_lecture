# Day 1 
## NVM 설치
    1. node
    2. nvm use {버전이름}
## Javscript
    - 모듈화 
        - why? 여러 파일에서 같은 변수 이름을 만들면 덮어씌어진다. 
        -> common.js -> ECMA Script
    - 표준화
    - Javscript 인터프리터 (Javascript -> 컴퓨터 언어로 변환하는 것)
        -> Chrome, Firefox, IE 내장된 엔진
            -> 엔진에 따라서 지원하는 표준화된 스크립트 버전이 다르다. 
    - Node.js
        - 서버사이드 Chrome V8 Engine 기반 Javascript 
    - Javascript는 독립된 시스템(웹, 서버)에서 자유롭게 사용할 수 있는 언어. 
        - 웹 (html 안에서) -> console. => 웹 개발자 도구 
        - 서버사이드 (node) -> cmd 창 (node 패키지가 작동되고 있는)
## NPM
    - node를 깔면 자동으로 npm 설치됨
    - cmd에서 `npm --version`
    - 폴더 생성 -> 폴더로 들어가기 (`cd {폴더 이름}`)
        - `npm init` -> npm 패키지 생성
        - `npm i express --save` 
            -> `--save` 지금 있는 패키지에서만 사용 (설치)
        - `package.json` 안에 script 작성
            - "start": "node index.js"
            -> `npm run start` 라는 명령어로 실행 가능
        - 파일 수정 한 뒤에는 다시 실행
## Express 직접 설치하고 실행하기
    1. `npm init`
    2. `npm i express --save`
    3. package.json에 start 스크립트 추가
        - "start": "node index.js"
    4. `npm run start`로 테스트
## Express Generator 사용하기
    1. `npm i expres-generator -g` 
        전역으로 (globally) express-generator라는 패키지 설치
    2. `express --view=pug` 
        - pug template을 view engine으로 사용하는 express app 설치


# Day 2
## CRUD / GET,POST,PUT,DELETE
- CRUD
    - 방식
    - C = create = POST
    - R = read = GET
    - U = update = PUT
    - D = delete = DELETE
- GET, POST, PUT, DELETE
    - GET -> 어떤 걸 가져올지
        - ex. (get) /users -> 유저 정보를 다 달라
        - ex. (get) /user/5 -> 5번 유저 정보를 달라
    - POST -> 생성할 것
        - ex. (post) /user -> 유저를 생성한다
            - user 데이터를 함께 보낸다
        - 같은 데이터 2번 보내면 2개 생성 (같은걸로)
    - PUT -> 수정/생성
        - ex. (put) /user -> 유저를 생성한다
        - ex. (put) /user/5
            -> 5번 유저가 없으면 생성하고 있으면 수정
        - 같은 데이터 2번 보내면 1개만 생성(두번째는 수정)
    - DELETE -> 삭제
        - ex. (delete) /user/5 -> 5번 유저 정보를 삭제 
## REST API
- CRUD를 기반으로 함
- /user/5, /users, /user -> url 설계를 CRUD 기반으로 함 
## 로그인
### REST API
- 이메일, 패스워드를 받아서 (요청) 성공, 실패 여부를 응답
    - 성공 = 이메일, 패스워드가 원하는 문자열과 같으면
    - 실패 = 이메일, 패스워드가 다르면
        - 실패 1. 아예 이메일, 패스워드가 없다. -> 잘못된 요청이다.
        - 실패 2. 이메일이 틀렸다. -> 이메일이 틀렸다. (회원정보가 없다.)
        - 실패 3. 패스워드가 틀렸다. -> 패스워드가 틀렸다.
 - CRUD 중에...? 
    - (POST) /login

### (+) 함수
- input을 받아서 -> {...} -> output을 내는 것
- `return {값}`으로 return 한다. 
- input = 인자, 매개변수, parameter,...

```javascript
var add = function(a, b) {
    return a+b;
}

var result = add(3, 5)// add 함수 호출
console.log(result) // 8이 log에 찍힘
```

```javascript
var abc = function (a) { // return이 없는 함수
    console.log(a);
}
abc('이거 좀 출력해라'); // abc 함수 호출
```

```javascript
var c = function () {
    return '아무것도 없는 함수'
}
c(); // c 함수 호출
```

```javascript
function (req, res) {
    res.send('...')    
}
```

### JSON = JavaScript Object Notation
- Key, Value로 이루어진 값

```json
{ "name" : "Jenny" }
```
```javascript
var a = { name : "Jenny" }
a.name // "Jenny"
a["name"] // "Jenny"

var user = {
    user1: {
        name: "Jenny",
        age: 13
    },
    user2: {
        name: "Nusdf",
        age: 20
    }
}
user.user1.name // Jenny
user.user2.age

var req = {
    body: {
        email: "aaa@gmail.com",
        password: "12345"
    }
}
var email = req.body.email
var password = req.body.password
```

```javascript
// array = list = 배열
var users = {
    "usernames": ["Jenny", "Perl", "Apple"],
    "ages": [13, 24, 30],
}
users.usernames[0] // Jenny
users.ages[2] // 30

var aa = {
    "users": [
        {
            "name": "asef",
            "age": 20
        },
        {
            "name": "PAB", 
            "age": 30
        }
    ]
}
aa.users[0].name // asef
aa.users[1].age
```

## 조건 / 반복
A라면 B하고, 아니라면 C한다.
if (A) {
    B
} else if (A') {
    BB
} else {
    C
}
