//Upload : 파일 upload와 download에 관한 정보를 주고받는 페이지
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
var mysql = require('mysql');

//DB 연결
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  port : 3306,
  database: 'treenod',
  debug : false
});

//multer 모듈을 사용
//upload에 사전 설정 저장
let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

//해당하는 파일의 정보를 전달
router.get('/show/:postID', (req, res, next) => {
  const id = req.params.postID;

  connection.query(`SELECT * FROM File WHERE '${id}' = postID`, function (err, rows, fields) {
    res.send({success:true, msg: rows});
  });
})

//새로운 파일을 가져와 백엔드의 로컬 저장소에 저장
router.post("/create/:writerID", upload.array("files"), function (req, res) {
    const writer = req.params.writerID;

    connection.query(`SELECT id FROM Post WHERE '${writer}' = writerID`, function (err, rows, fields) {
      if(!err){
        var postId = rows[rows.length - 1].id;
        for(var i = 0; i < req.files.length; i++)
        {
          connection.query(`INSERT INTO File(name, id, postID) VALUES('${req.files[i].originalname}', '${req.files[i].filename}', '${postId}')`, (err, rows, fields) => {
            if(!err){
              console.log("성공!");
            }
            else {
              console.log(err);
            }
          });
        }
      }
      else {
        console.log(err.message);
      }
    });

    return res.sendStatus(200);
});

//다운로드 링크
router.get('/download/:id/:name', function(req, res){
  var id = req.params.id;
  var name = req.params.name;
  console.log(name);
  var file = __dirname + `/../upload/${id}`;
  res.download(file, name); // Set disposition and send it.
});
module.exports = router;
